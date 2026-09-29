const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/jose1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sources = [{"name":"hero","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-23806065-e783-427c-9bc0-f3d771688366.png"},{"name":"about","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-2731444b-5fc3-41fd-9494-28de2944e16d.png"},{"name":"projects","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-b3c74b68-e1e2-4674-850e-2287cd376c6f.png"},{"name":"experience","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-ab4a21b8-d592-4b3e-ae71-9bfddbe98c02.png"},{"name":"ai","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-2ea1bd5e-c6d7-4221-b39f-d5954c9a7081.png"},{"name":"stack","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-f2b18214-393a-4085-929f-67c381e79ab1.png"},{"name":"breadth","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-d4194c61-61a5-486b-bc43-397ca526fd7c.png"},{"name":"contact","path":"C:\\Users\\jose1\\.codex\\generated_images\\01a0e1bc-0d3d-7d93-973f-e9c51ed04aea\\exec-56f3c31f-ee78-43c8-a6ff-3de2121d2302.png"}];
fs.mkdirSync(path.join(__dirname, '../public/art'), { recursive: true });
Promise.all(sources.map(async ({name,path:source}) => {
  const target = path.join(__dirname, '../public/art', name + '.webp');
  await sharp(source).webp({ quality: 90, effort: 6 }).toFile(target);
  console.log(name, fs.statSync(target).size);
})).catch(error => { console.error(error); process.exitCode = 1; });
