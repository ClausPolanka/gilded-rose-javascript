import { Shop, Item } from '../gilded_rose';

describe("Gilded Rose", function () {

    describe("Regular item", function() {
        it("should decrease quality by one", function () {
            const gildedRose = new Shop([new Item("Regular Item", 10, 5)]);
            const items1Day = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(4);
            const items2Days = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(3);
        });

        it("should not decrease quality below zero", function() {
            const gildedRose = new Shop([new Item("Regular Item", 10, 1)]);
            const items1Day = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(0);
            const items2Days = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(0);
        });

        it("should decrease quality by two after sell-in day", function() {
            const gildedRose = new Shop([new Item("Regular Item", 1, 10)]);
            const items1Day = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(9);
            const items2Days = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(7);
            const items3Days = gildedRose.updateQuality();
            expect(items1Day[0].quality).toEqual(5);
        });
    });

});
