import { Shop, Item } from '../gilded_rose';

describe("Gilded Rose", function () {
    function createShop(itemName, { quality = 10, sellIn = 10 }) {
        return new Shop([new Item(itemName, sellIn, quality)]);
    }

    function updateAndCheckQuality(shop, expQuality) {
        const items = shop.updateQuality();

        expect(items[0].quality).toEqual(expQuality);
    }

    function updateAndCheckSellIn(shop, expSellIn) {
        const items = shop.updateQuality();

        expect(items[0].sellIn).toEqual(expSellIn);
    }

    describe("Regular item", function() {
        it("should decrease quality by one", function () {
            const gildedRose = new Shop([new Item("Regular Item", 10, 5)]);

            updateAndCheckQuality(gildedRose, 4);
            updateAndCheckQuality(gildedRose, 3);
        });

        it("should not decrease quality below zero", function() {
            const gildedRose = new Shop([new Item("Regular Item", 10, 1)]);

            updateAndCheckQuality(gildedRose, 0);
            updateAndCheckQuality(gildedRose, 0);
        });

        it("should decrease quality by two after sell-in day", function() {
            const gildedRose = new Shop([new Item("Regular Item", 1, 10)]);

            updateAndCheckQuality(gildedRose, 9);
            updateAndCheckQuality(gildedRose, 7);
            updateAndCheckQuality(gildedRose, 5);
        });

        it("should not decrease quality below zero", function() {
            const gildedRose = new Shop([new Item("Regular Item", -1, 0)]);

            updateAndCheckQuality(gildedRose, 0);
            updateAndCheckQuality(gildedRose, 0);
        });
    });

    describe("Aged Brie", function() {
        const name = "Aged Brie";

        it("should increase quality by one", function() {
            const gildedRose = new Shop([new Item(name, 10, 5)], [{
                incrementQuality: true,
            }]);

            updateAndCheckQuality(gildedRose, 6);
            updateAndCheckQuality(gildedRose, 7);
        });

        it("should not increase quality above 50", function() {
            const gildedRose = new Shop([new Item(name, 10, 49)], [{
                incrementQuality: true,
            }]);

            updateAndCheckQuality(gildedRose, 50);
            updateAndCheckQuality(gildedRose, 50);
        });

        it("should increase quality by two after sell-in day", function() {
            const gildedRose = new Shop([new Item(name, 1, 5)], [{
                incrementQuality: true,
            }]);

            updateAndCheckQuality(gildedRose, 6);
            updateAndCheckQuality(gildedRose, 8);
        });

        describe("if sell-in day is negative", function() {
            it("should not increase quality above 50", function() {
                const gildedRose = new Shop([new Item(name, -10, 49)], [{
                    incrementQuality: true,
                }]);
    
                updateAndCheckQuality(gildedRose, 50);
                updateAndCheckQuality(gildedRose, 50);
            });
        });
    });

    describe("Sulfuras", function() {
        const name = "Sulfuras, Hand of Ragnaros";

        it("should not change quality", function() {
            const sellIn = 40;
            const quality = 80;
            const gildedRose = new Shop([new Item(name, sellIn, quality)], [{
                freeze: true,
            }]);

            updateAndCheckQuality(gildedRose, quality);
            updateAndCheckQuality(gildedRose, quality);
        });

        it("should not change sell-in day", function() {
            const gildedRose = new Shop([new Item(name, 10, 80)], [{
                freeze: true,
            }]);

            updateAndCheckSellIn(gildedRose, 10);
            updateAndCheckSellIn(gildedRose, 10);
        });

        describe("if sell-in is negative", function() {
            it("should not change quality", function() {
                const sellIn = -40;
                const quality = 80;
                const gildedRose = new Shop([new Item(name, sellIn, quality)], [{
                    freeze: true,
                }]);
    
                updateAndCheckQuality(gildedRose, quality);
                updateAndCheckQuality(gildedRose, quality);
            });
    
            it("should not change sell-in day", function() {
                const gildedRose = new Shop([new Item(name, -10, 80)], [{
                    freeze: true,
                }]);
    
                updateAndCheckSellIn(gildedRose, -10);
                updateAndCheckSellIn(gildedRose, -10);
            });
        });
    });

    describe.skip("Backstage passes", function() {
        const name = "Backstage passes to a TAFKAL80ETC concert";

        it("should increase quality by 1 ", function() {
            const shop = createShop(name, { quality: 5, sellIn: 15 }, {
                qualityRules: {
                    10: 2,
                    5: 3,
                },
                afterPassed: 0,
            });

            updateAndCheckQuality(shop, 6);
            updateAndCheckQuality(shop, 7);
        });

        describe("if sell-in day is <= 10 and > 5", function() {
            it("should increase quality by 2", function() {
                const shop = createShop(name, { quality: 5, sellIn: 10 });

                updateAndCheckQuality(shop, 7);
                updateAndCheckQuality(shop, 9);
            });

            it("should not increase quality above 50", function() {
                const shop = createShop(name, { quality: 49, sellIn: 10 });

                updateAndCheckQuality(shop, 50);
                updateAndCheckQuality(shop, 50);
            });
        });

        describe("if sell-in day is <= 5", function() {
            it("should increase quality by 3", function() {
                const shop = createShop(name, { quality: 5, sellIn: 5 });

                updateAndCheckQuality(shop, 8);
                updateAndCheckQuality(shop, 11);
            });

            it("should not increase quality above 50", function() {
                const shop = createShop(name, { quality: 49, sellIn: 5 });

                updateAndCheckQuality(shop, 50);
                updateAndCheckQuality(shop, 50);
            });
        });

        it("should set quality to 0 after sell-in day", function() {
            const shop = createShop(name, { quality: 5, sellIn: 0 });

            updateAndCheckQuality(shop, 0);
            updateAndCheckQuality(shop, 0);
        });
    });
});
