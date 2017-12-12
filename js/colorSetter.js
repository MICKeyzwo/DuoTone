function colorSetter(canvas) {
    this.ctx = canvas.getContext("2d");
    this.idt = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.data = this.idt.data;
    this.width = this.idt.width;
    this.height = this.idt.height;
};
colorSetter.prototype.setColor = function(prop) {
    let idx = (prop.y * this.height + prop.x) * 4;
    this.data[idx] = prop.r || 0;
    this.data[idx + 1] = prop.g || 0;
    this.data[idx + 2] = prop.b || 0;
    this.data[idx + 3] = prop.a || 255;
};
colorSetter.prototype.render = function() {
    this.ctx.putImageData(this.idt, 0, 0);
}
module.exports = colorSetter;