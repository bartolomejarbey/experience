import type { Model } from "@/lib/types/model";
import type { OrbitScene, PanoramaScene, Scene } from "@/lib/types/scene";
import { buildPanoramaUrl } from "@/lib/supabase/public-url";

const MODEL_ID = "luma" as const;

const url = (folder: string) => buildPanoramaUrl(MODEL_ID, folder, "medium-4k");
const preview = (folder: string) => buildPanoramaUrl(MODEL_ID, folder, "preview");

const FRAME_COUNT = 36;

/** Frame index at which each canonical view sits in the orbit. With 36
 *  frames the loop steps every 10° — front at 0, right at 9, back at 18,
 *  left at 27. */
const FRAME_FRONT = 0;
const FRAME_RIGHT = 9;

const exteriorOrbit: OrbitScene = {
  type: "orbit",
  id: "exterior-orbit",
  title: "Pohled zvenku",
  preview: preview("exterior-orbit/anthracite"),
  frameCount: FRAME_COUNT,
  startFrame: FRAME_FRONT,
  variantKeys: ["facade"],
  sceneFolder: "exterior-orbit",
  hotSpots: [
    {
      id: "hs-orbit-enter",
      type: "scene",
      targetSceneId: "scene-03-living-room",
      labelCs: "Vstoupit dovnitř",
      // Visible only on the front-facing quadrant where the door is.
      framesVisible: { start: FRAME_COUNT - 2, end: 2 },
      x: 0.5,
      y: 0.72,
    },
    {
      id: "hs-orbit-info-facade",
      type: "info",
      titleCs: "Fasáda — sibiřský modřín",
      bodyCs:
        "Sibiřský modřín ve dvou liniích povrchových úprav: pět matných barev (mechově zelená, černá matná, antracitová, písková, bronzově hnědá) a pět odstínů transparentní lazury, které ponechávají kresbu dřeva. Všechny varianty mají životnost přes 40 let bez výměny.",
      framesVisible: { start: FRAME_FRONT, end: FRAME_RIGHT },
      x: 0.7,
      y: 0.4,
    },
  ],
};

const livingRoom: PanoramaScene = {
  type: "panorama",
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
      targetSceneId: "exterior-orbit",
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
};

const bedroom: PanoramaScene = {
  type: "panorama",
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
};

const bathroom: PanoramaScene = {
  type: "panorama",
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
};

const utility: PanoramaScene = {
  type: "panorama",
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
};

const scenes: Record<string, Scene> = {
  [exteriorOrbit.id]: exteriorOrbit,
  [livingRoom.id]: livingRoom,
  [bedroom.id]: bedroom,
  [bathroom.id]: bathroom,
  [utility.id]: utility,
};

export const luma: Model = {
  id: "luma",
  name: "Luma",
  type: "Bungalov 4+kk",
  area: 112,
  basePrice: 4_850_000,
  currency: "CZK",
  status: "available",
  defaultSceneId: exteriorOrbit.id,
  info: {
    tagline: "Klidný bungalov pro tři až čtyři lidi.",
    description:
      "Luma je přízemní dům 4+kk navržený pro rodiny, které hledají jednoduchý život na jedné úrovni. Kompaktní půdorys 112 m² spojuje otevřený obývací prostor s kuchyní, dvě ložnice, koupelnu a technickou místnost. Velkoformátová okna otevírají interiér do zahrady a drží dům prosvětlený po celý den.",
    highlights: [
      "Bezbariérové bydlení na jedné úrovni",
      "Energetická třída A — nízká provozní spotřeba",
      "Sibiřský modřín s životností přes 40 let",
      "Tepelné čerpadlo vzduch–voda standardně",
      "Připraveno na fotovoltaiku a wallbox",
    ],
    specs: [
      { label: "Dispozice", value: "4+kk" },
      { label: "Užitná plocha", value: "112 m²" },
      { label: "Zastavěná plocha", value: "138 m²" },
      { label: "Rozměry", value: "14,2 × 9,8 m" },
      { label: "Výška hřebene", value: "4,6 m" },
      { label: "Energetická třída", value: "A" },
      { label: "Roční spotřeba", value: "≈ 6 200 kWh" },
      { label: "Doba výstavby", value: "16–20 týdnů" },
    ],
    materials: [
      { label: "Nosná konstrukce", value: "Dřevostavba, KVH hranoly" },
      { label: "Fasáda", value: "Sibiřský modřín, 28 mm" },
      { label: "Střecha", value: "Falcovaný plech, antracit" },
      { label: "Okna", value: "Schüco AWS 75 SI+, trojsklo" },
      { label: "Podlaha", value: "Třívrstvý dub masiv, 14 mm" },
      { label: "Vytápění", value: "Tepelné čerpadlo Daikin 8 kW" },
      { label: "Rekuperace", value: "Centrální, účinnost 92 %" },
    ],
  },
  configurations: [
    {
      key: "facade",
      labelCs: "Fasáda",
      defaultOptionId: "anthracite",
      options: [
        // Pět matných barev
        { id: "moss-green", labelCs: "Mechově zelená", priceModifier: 0 },
        { id: "black-matte", labelCs: "Černá matná", priceModifier: 0 },
        { id: "anthracite", labelCs: "Antracitová", priceModifier: 0 },
        { id: "sand", labelCs: "Písková", priceModifier: 0 },
        { id: "bronze-brown", labelCs: "Bronzově hnědá", priceModifier: 0 },
        // Pět dřevěných lazur
        { id: "wood-natural", labelCs: "Dřevo přírodní", priceModifier: 0 },
        { id: "wood-honey", labelCs: "Dřevo medové", priceModifier: 0 },
        { id: "wood-walnut", labelCs: "Dřevo ořech", priceModifier: 0 },
        { id: "wood-smoked", labelCs: "Dřevo kouřové", priceModifier: 0 },
        { id: "wood-ebony", labelCs: "Dřevo eben", priceModifier: 0 },
      ],
    },
    {
      key: "terrace",
      labelCs: "Terasa",
      defaultOptionId: "wood",
      options: [
        { id: "wood", labelCs: "Dřevěná", priceModifier: 145_000 },
        { id: "stone", labelCs: "Kamenná", priceModifier: 195_000 },
      ],
    },
  ],
  scenes,
};
