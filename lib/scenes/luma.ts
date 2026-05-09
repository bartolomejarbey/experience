import type { Model } from "@/lib/types/model";
import type { Scene } from "@/lib/types/scene";
import { buildPanoramaUrl } from "@/lib/supabase/public-url";

const MODEL_ID = "luma" as const;

const url = (folder: string) => buildPanoramaUrl(MODEL_ID, folder, "medium-4k");
const preview = (folder: string) => buildPanoramaUrl(MODEL_ID, folder, "preview");

const scenes: Record<string, Scene> = {
  "scene-01-exterior-dark": {
    id: "scene-01-exterior-dark",
    title: "Pohled zepředu",
    panorama: url("scene-01-exterior-dark"),
    preview: preview("scene-01-exterior-dark"),
    hfov: 100,
    pitch: -5,
    yaw: 0,
    exteriorView: "front",
    facadeVariant: "dark",
    hotSpots: [
      {
        id: "hs-enter-from-dark",
        type: "scene",
        pitch: -12,
        yaw: 0,
        targetSceneId: "scene-03-living-room",
        labelCs: "Vstoupit dovnitř",
      },
      {
        id: "hs-info-dark-facade",
        type: "info",
        pitch: 6,
        yaw: 30,
        titleCs: "Tmavá fasáda — opálený modřín",
        bodyCs:
          "Sibiřský modřín ošetřený japonskou technikou Shou Sugi Ban. Povrch je odolný proti UV i hmyzu a nevyžaduje opakovaný nátěr.",
      },
    ],
  },

  "scene-02-exterior-light": {
    id: "scene-02-exterior-light",
    title: "Pohled zepředu",
    panorama: url("scene-02-exterior-light"),
    preview: preview("scene-02-exterior-light"),
    hfov: 100,
    pitch: -5,
    yaw: 0,
    exteriorView: "front",
    facadeVariant: "light",
    hotSpots: [
      {
        id: "hs-enter-from-light",
        type: "scene",
        pitch: -12,
        yaw: 0,
        targetSceneId: "scene-03-living-room",
        labelCs: "Vstoupit dovnitř",
      },
      {
        id: "hs-info-light-facade",
        type: "info",
        pitch: 6,
        yaw: 30,
        titleCs: "Světlá fasáda — přírodní modřín",
        bodyCs:
          "Sibiřský modřín v přírodním tónu s ochranným olejem. Postupem let získá stříbřitě šedou patinu. Doporučujeme obnovu nátěru po 5–7 letech.",
      },
    ],
  },

  "scene-03-living-room": {
    id: "scene-03-living-room",
    title: "Obývací pokoj",
    panorama: url("scene-03-living-room"),
    preview: preview("scene-03-living-room"),
    hfov: 100,
    pitch: 0,
    yaw: 0,
    hotSpots: [
      {
        id: "hs-living-to-bedroom",
        type: "scene",
        pitch: -25,
        yaw: 90,
        targetSceneId: "scene-04-bedroom",
        labelCs: "Přejít do ložnice",
      },
      {
        id: "hs-living-to-bathroom",
        type: "scene",
        pitch: -25,
        yaw: 180,
        targetSceneId: "scene-05-bathroom",
        labelCs: "Přejít do koupelny",
      },
      {
        id: "hs-living-to-utility",
        type: "scene",
        pitch: -25,
        yaw: 270,
        targetSceneId: "scene-06-utility",
        labelCs: "Přejít do technické místnosti",
      },
      {
        id: "hs-living-to-exterior",
        type: "scene",
        pitch: -15,
        yaw: 0,
        targetSceneId: "scene-01-exterior-dark",
        labelCs: "Vyjít ven",
      },
      {
        id: "hs-info-floor",
        type: "info",
        pitch: -30,
        yaw: 45,
        titleCs: "Podlaha — dub masiv",
        bodyCs:
          "Třívrstvá dubová masivní podlaha, povrchová úprava UV-tvrzeným olejem. Tloušťka 14 mm, šířka prkna 180 mm. Vhodná i pro podlahové vytápění.",
      },
    ],
  },

  "scene-04-bedroom": {
    id: "scene-04-bedroom",
    title: "Ložnice",
    panorama: url("scene-04-bedroom"),
    preview: preview("scene-04-bedroom"),
    hfov: 100,
    pitch: 0,
    yaw: 0,
    hotSpots: [
      {
        id: "hs-bedroom-to-living",
        type: "scene",
        pitch: -20,
        yaw: 180,
        targetSceneId: "scene-03-living-room",
        labelCs: "Zpět do obývacího pokoje",
      },
      {
        id: "hs-info-window",
        type: "info",
        pitch: 5,
        yaw: 90,
        titleCs: "Hliníkové okno se skrytými závěsy",
        bodyCs:
          "Profil Schüco AWS 75 SI+ s trojsklem (Ug 0,5 W/m²K). Skryté závěsy uvnitř rámu — okenní křídlo působí jako jeden čistý prvek.",
      },
    ],
  },

  "scene-05-bathroom": {
    id: "scene-05-bathroom",
    title: "Koupelna",
    panorama: url("scene-05-bathroom"),
    preview: preview("scene-05-bathroom"),
    hfov: 90,
    pitch: 0,
    yaw: 0,
    hotSpots: [
      {
        id: "hs-bathroom-to-living",
        type: "scene",
        pitch: -20,
        yaw: 180,
        targetSceneId: "scene-03-living-room",
        labelCs: "Zpět do obývacího pokoje",
      },
      {
        id: "hs-info-tiles",
        type: "info",
        pitch: -10,
        yaw: 60,
        titleCs: "Velkoformátový porcelán",
        bodyCs:
          "Italský porcelán Mutina 120 × 60 cm, povrch matný. Spáry redukované na 1,5 mm — povrch působí monoliticky.",
      },
    ],
  },

  "scene-06-utility": {
    id: "scene-06-utility",
    title: "Technická místnost",
    panorama: url("scene-06-utility"),
    preview: preview("scene-06-utility"),
    hfov: 90,
    pitch: 0,
    yaw: 0,
    hotSpots: [
      {
        id: "hs-utility-to-living",
        type: "scene",
        pitch: -20,
        yaw: 180,
        targetSceneId: "scene-03-living-room",
        labelCs: "Zpět do obývacího pokoje",
      },
      {
        id: "hs-info-heatpump",
        type: "info",
        pitch: 0,
        yaw: 0,
        titleCs: "Tepelné čerpadlo vzduch–voda",
        bodyCs:
          "Daikin Altherma 3 H HT, výkon 8 kW, COP 4,3. Zajišťuje vytápění i ohřev teplé užitkové vody. Provoz tichý, vhodný i u sousední zástavby.",
      },
    ],
  },
};

export const luma: Model = {
  id: "luma",
  name: "Luma",
  type: "Bungalov 4+kk",
  area: 112,
  basePrice: 4_850_000,
  currency: "CZK",
  status: "available",
  defaultSceneId: "scene-01-exterior-dark",
  configurations: [
    {
      key: "facade",
      labelCs: "Fasáda",
      defaultOptionId: "dark",
      options: [
        { id: "dark", labelCs: "Tmavá", priceModifier: 0, facadeVariant: "dark" },
        {
          id: "light",
          labelCs: "Světlá",
          priceModifier: -120_000,
          facadeVariant: "light",
        },
      ],
    },
    {
      key: "terrace",
      labelCs: "Terasa",
      defaultOptionId: "small",
      options: [
        { id: "none", labelCs: "Žádná", priceModifier: 0 },
        { id: "small", labelCs: "Malá (12 m²)", priceModifier: 145_000 },
        { id: "large", labelCs: "Velká (24 m²)", priceModifier: 285_000 },
      ],
    },
    {
      key: "pergola",
      labelCs: "Pergola",
      defaultOptionId: "no",
      options: [
        { id: "no", labelCs: "Ne", priceModifier: 0 },
        { id: "yes", labelCs: "Ano", priceModifier: 110_000 },
      ],
    },
  ],
  scenes,
};
