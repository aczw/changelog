import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

import { readFileSync } from "node:fs";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";

type ContentKind =
  | { kind: "route"; heading: string }
  | { kind: "post"; title: string; date: Date }
  | { kind: "release"; version: string; date: Date; commit?: string };

const GET: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const params = requestUrl.searchParams;

  const maybeHeading = params.get("heading");
  const maybeRelease = params.get("release");

  let content: ContentKind = { kind: "route", heading: "" };
  if (maybeHeading) {
    content = { kind: "route", heading: maybeHeading };
  } else if (maybeRelease) {
    const release = await getEntry("changelog", maybeRelease);
    if (release) {
      content = { kind: "release", ...release.data };
    }
  }

  const logo = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    fill="currentColor"
    viewBox="0 0 25 25"
    tw="mb-3 text-[#9A91FE]"
  >
    <path
      fill-rule="evenodd"
      d="M.626.626a2.139 2.139 0 0 1 3.025 0l1.82 1.821A12.2 12.2 0 0 1 12.536.21a12.2 12.2 0 0 1 7.022 2.21L21.35.625a2.139 2.139 0 0 1 3.025 3.025L22.58 5.443a12.2 12.2 0 0 1 2.21 7.022 12.2 12.2 0 0 1-2.238 7.063l1.82 1.821a2.139 2.139 0 1 1-3.024 3.025l-1.833-1.833a12.2 12.2 0 0 1-6.981 2.18 12.2 12.2 0 0 1-7.023-2.209L3.65 24.374a2.139 2.139 0 1 1-3.025-3.025l1.862-1.861a12.2 12.2 0 0 1-2.21-7.023c0-2.594.806-5 2.181-6.981L.626 3.65a2.139 2.139 0 0 1 0-3.025ZM8.61 19.414a7.943 7.943 0 0 0 3.925 1.03 7.944 7.944 0 0 0 3.88-1.005L12.5 15.524l-3.89 3.89Zm.866-6.914-3.89 3.89a7.943 7.943 0 0 1-1.03-3.925c0-1.408.364-2.731 1.005-3.88L9.476 12.5Zm6.048 0 3.935 3.934a7.944 7.944 0 0 0 1.055-3.969 7.943 7.943 0 0 0-1.03-3.925l-3.96 3.96Zm.935-6.984L12.5 9.476 8.566 5.54a7.943 7.943 0 0 1 3.969-1.055c1.426 0 2.766.374 3.924 1.03Z"
      clip-rule="evenodd"
    />
  </svg>`;

  const markup = html(`<div
    tw="h-full text-[16px] w-full bg-[#0A0919] flex flex-col justify-between p-20"
  >
    <div tw="flex flex-col">
      ${
        content.kind === "route"
          ? `${logo} <span tw="text-8xl text-[#9A91FE] font-bold">Charles Wang</span>`
          : `<span tw="text-[#C3BDFF] mb-3.5 font-bold text-7xl">Website patch notes for ${content.version}</span>
          
          <span tw="text-[#D6D3FF] mb-3.5 text-6xl">${(content.kind === "release" ? "Released " : "") + content.date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>`
      }
      ${
        content.kind === "release"
          ? `<span tw="text-[#6B62CB] text-6xl">${content.commit ? `Commit ${content.commit.slice(0, 7)}` : "Latest version"}</span>`
          : ""
      }
    </div>

    <div tw="text-7xl flex flex-col text-[#D6D3FF]">
      ${content.kind === "route" ? content.heading : logo}
    </div>
  </div>`);

  const svg = await satori(markup, {
    width: 1280,
    height: 720,
    fonts: [
      {
        name: "Atkinson Hyperlegible",
        data: readFileSync(`${process.cwd()}/public/_fonts/AtkinsonHyperlegible-Regular.ttf`),
        style: "normal",
        weight: 400,
      },
      {
        name: "Atkinson Hyperlegible",
        data: readFileSync(`${process.cwd()}/public/_fonts/AtkinsonHyperlegible-Bold.ttf`),
        style: "normal",
        weight: 700,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1280,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, no-transform, max-age=604800" /* one week */,
    },
  });
};

export { GET };
