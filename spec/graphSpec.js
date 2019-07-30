describe("Colors", function() {

    describe("Return Value Tests", function() {
        it("Should return a 2 dimensional array of light and dark colors", function() {
            colors();
            expect(colors()).toEqual([['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210'], ['#3969b1', '#da7c30', '#3e9651', '#cc2529', '#535154', '#6b4c9a', '#922428', '#948b3d']]);
        });
        it("Should return an array of light colors", function() {
            colors();
            expect(colors()[0]).toEqual(['#7294cb', '#e1974c', '#84ba5b', '#d35e60', '#808585', '#9067a7', '#ab6857', '#ccc210']);
        });
        it("Should return an array of dark colors", function() {
            colors();
            expect(colors()[1]).toEqual(['#3969b1', '#da7c30', '#3e9651', '#cc2529', '#535154', '#6b4c9a', '#922428', '#948b3d']);
        });
    });
})