const ADJ = [
    "Swift",
    "Calm",
    "Bright",
    "Quiet",
    "Bold",
    "Sunny",
    "Clever",
    "Gentle",
    "Brave",
    "Lucky",
    "Merry",
    "Quick",
    "Sly",
    "Warm",
    "Cool",
    "Wild",
    "Nimble",
    "Fearless",
    "Silent",
    "Golden",
    "Icy",
    "Rapid",
    "Sturdy",
    "Kind",
    "Shining",
    "Stormy",
    "Daring",
    "Wise",
    "Fierce",
    "Playful",
    "Steady",
    "Curious",
];

const COLOR = [
    "Amber",
    "Azure",
    "Coral",
    "Crimson",
    "Emerald",
    "Golden",
    "Indigo",
    "Ivory",
    "Jade",
    "Onyx",
    "Pearl",
    "Ruby",
    "Sapphire",
    "Silver",
    "Teal",
    "Violet",
    "Scarlet",
    "Cobalt",
    "Turquoise",
    "Copper",
    "Bronze",
    "Lilac",
    "Magenta",
    "Mint",
    "Ochre",
    "Slate",
    "Ebony",
    "Rose",
    "Topaz",
    "Cerulean",
    "Maroon",
    "Olive",
];

const NOUN = [
    "Otter",
    "Falcon",
    "Panda",
    "Fox",
    "Wolf",
    "Hawk",
    "Bear",
    "Lynx",
    "Heron",
    "Badger",
    "Raven",
    "Deer",
    "Owl",
    "Seal",
    "Crane",
    "Moose",
    "Tiger",
    "Rabbit",
    "Bison",
    "Cougar",
    "Dolphin",
    "Eagle",
    "Gecko",
    "Jaguar",
    "Koala",
    "Leopard",
    "Marten",
    "Narwhal",
    "Orca",
    "Panther",
    "Turtle",
    "Yak",
];

// FNV-1a hash, good enough for name-picking, not for anything security-sensitive
const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

export const nameFromId = (id: string) => {
    const h = hash(id);
    return `${ADJ[h & 31]} ${COLOR[(h >>> 5) & 31]} ${NOUN[(h >>> 10) & 31]}`;
};
