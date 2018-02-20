const MAX_QUALITY = 50;
const MIN_QUALITY = 0;

export class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class ItemOptions {
  constructor({
    incrementQuality = false,
    qualityRules = null,
    freeze = false,
    afterPassed = null,
  } = {}) {
    this.incrementQuality = incrementQuality;
    this.qualityRules = qualityRules; // { [sellIn]: qualityChange } , e.g. { "10": 2, "5": 3 }
    this.freeze = freeze;
  }

  getNewQuality(quality, sellIn) {
    if (this.freeze) {
      return quality;
    }

    let change = 1;

    if (this.qualityRules) {
      Object.keys(this.qualityRules).some(function(limit) {
        if (limit >= sellIn) {
          change = this.qualityRules[limit];
          return false;
        }
      });
    } else if (sellIn <= 0) {
      change = 2;
    }

    let newQuality = quality + (this.incrementQuality ? 1 : -1) * change;

    return Math.max(MIN_QUALITY, Math.min(MAX_QUALITY, newQuality));
  }

  updateSellIn() {
    return !this.freeze;
  }
}

export class Shop {
  constructor(items=[], options=[]){
    this.items = items;
    this.options = items.map((item, index) => new ItemOptions(options[index]));
  }
  updateQuality() {
    for (var i = 0; i < this.items.length; i++) {
      const options = this.options[i];
      const item = this.items[i];

      item.quality = options.getNewQuality(item.quality, item.sellIn);

      if (options.updateSellIn()) {
        item.sellIn -= 1;
      }
    }

    return this.items;
  }
}
