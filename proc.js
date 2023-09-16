class Dict {
  constructor() {
    this.raw = {};
    this.env = [];
  }

  update(word) {
    this.raw[this.env[0]][this.env[1]].push(word);
  }

  setEnv(str, unit) {
    unit = parseInt(unit);
    if (!this.raw[str]) this.raw[str] = new Map();
    this.raw[str][unit] = [];
    this.env = [str, unit];
  }
}

const D = new Dict();

async function proc() {
  const file = Bun.file("dict.txt");
  const text = await file.text();
  text.split("\n").forEach((line) => {
    line = cleanString(line);
    const words0 = line.split(" ");
    if (!isNumber(words0[0])) {
      D.setEnv(words0[0], words0[2]);
      return;
    }
    const words = words0
      .filter((x) => x.length !== 0)
      .filter((x) => !inValid(x))
      .filter((x) => !["adv", "v", "vt", "vi", "adj"].includes(x));
    const slicedWords = words.slice(1);
    if (words.slice(1).length === 1) {
      D.update(slicedWords[0]);
    }
  });
}

function inValid(x) {
  return x.includes(".") || x.includes("/") || x.includes("&") || nonAscii(x);
}

function nonAscii(str) {
  const asciiRegex = /[^\x00-\x7F]+/;
  return asciiRegex.test(str);
}

function any(arr) {
  return ["adv", "v", "vt", "vi", "adj"].some((element) =>
    arr.includes(element)
  );
}

function cleanString(s) {
  return s.replace(/\s+/g, " ");
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
