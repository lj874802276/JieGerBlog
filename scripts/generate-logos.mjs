// 用 sharp 把用户提供的两张 PNG 处理成网站 logo + favicon
// 输入：截屏图（横版 + 圆点 favicon）
// 输出：navbar logo（横版亮/暗）+ favicon（32/128/180/192 亮 + 暗）
import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";

const PROJECT = "e:/.workbuddy/bolg/JieGerBlog";
const SRC_HORIZONTAL =
	"C:/Users/Administrator/.workbuddy/clipboard-images/clipboard-2026-08-29T10-20-09-547Z-82f12820.png"; // 圆点 + "JieGer的blog" 文字
const SRC_FAVICON =
	"C:/Users/Administrator/.workbuddy/clipboard-images/clipboard-2026-08-29T10-20-09-548Z-21200b33.png"; // 仅圆点

const FAVICON_DIR = resolve(PROJECT, "public/favicon");
const LOGO_DIR = resolve(PROJECT, "src/assets/images/logo");

async function ensureDir(p) {
	if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function write(filePath, buffer) {
	await ensureDir(dirname(filePath));
	await rm(filePath, { force: true });
	const { writeFile } = await import("node:fs/promises");
	await writeFile(filePath, buffer);
	console.log("✓", filePath.replace(PROJECT, ""));
}

// 在 raw 像素层面清理低 alpha 像素的颜色，避免 resize 后产生彩色 halo 噪点
// - alpha < 50：完全清空（变全透明 + 黑 RGB，避免预乘后产生奇怪色）
// - 50 ≤ alpha < 220：按 alpha 线性去饱和（让半透明边缘贴近灰度，破坏彩色 halo）
// - alpha ≥ 220：保留原色
async function cleanAlphaEdges(rawBuf) {
	const { data, info } = rawBuf;
	const ch = info.channels; // 期望 4（RGBA）
	if (ch < 4) return data;
	for (let i = 0; i < data.length; i += ch) {
		const a = data[i + 3];
		if (a < 50) {
			data[i] = 0;
			data[i + 1] = 0;
			data[i + 2] = 0;
			data[i + 3] = 0;
		} else if (a < 220) {
			const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
			const t = (a - 50) / 170; // 0..1，alpha 越高越保真
			data[i] = Math.round(data[i] * t + gray * (1 - t));
			data[i + 1] = Math.round(data[i + 1] * t + gray * (1 - t));
			data[i + 2] = Math.round(data[i + 2] * t + gray * (1 - t));
		}
	}
	return data;
}

async function resizeFavicon(src, sizes, suffix = "", tint = null) {
	for (const size of sizes) {
		// 1) resize 到目标尺寸，透明背景，lanczos3 抗锯齿
		const raw = await sharp(src)
			.resize(size, size, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
				kernel: "lanczos3",
			})
			.ensureAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });
		// 2) 清理低 alpha 边缘的彩色噪点
		await cleanAlphaEdges(raw);
		// 3) 转回 PNG，必要时做提亮/提饱和（dark 主题变体）
		let pipe = sharp(raw.data, { raw: raw.info });
		if (tint) pipe = pipe.modulate(tint);
		const buf = await pipe.png().toBuffer();
		const name = suffix
			? `favicon-${suffix}-${size}.png`
			: `jiegerblog-${size}.png`;
		await write(resolve(FAVICON_DIR, name), buf);
	}
}

async function main() {
	await ensureDir(FAVICON_DIR);
	await ensureDir(LOGO_DIR);

	// 1) 横版 navbar logo：原图（黑字 + 绿圆点），亮暗共用同一张
	//    （用户没要求 logo 区分亮暗，且原设计就是深色字 + 亮色图形，亮暗模式都能用）
	const horizontalBuf = await sharp(SRC_HORIZONTAL).png().toBuffer();
	await write(
		resolve(LOGO_DIR, "jiegerbolg-light.png"),
		horizontalBuf,
	);
	await write(
		resolve(LOGO_DIR, "jiegerbolg-dark.png"),
		horizontalBuf,
	);

	// 2) favicon 亮色版（默认）：jiegerblog-* + favicon-light-*
	await resizeFavicon(SRC_FAVICON, [32, 128, 180, 192], "");
	await resizeFavicon(SRC_FAVICON, [32, 128, 180, 192], "light");

	// 3) favicon 暗色版：原图基础上提亮+饱和，让绿圆点在深色浏览器标签上更醒目
	//    brightness 1.25 + saturation 1.3：黑字→灰白（仍可辨），绿圆点→更鲜亮
	await resizeFavicon(SRC_FAVICON, [32, 128, 180, 192], "dark", {
		brightness: 1.25,
		saturation: 1.3,
	});

	console.log("Done.");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
