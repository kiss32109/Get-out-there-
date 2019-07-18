Spritesheet = function(filename)
{
    this.image = new Image();

    this.isImage = function(i) {
      return i instanceof HTMLImageElement;
    }

    if(this.isImage(filename)) { return filename; };

    if(filename.includes('body')) this.image.src = '../../images/game/characters/body/' + filename + '.png';
    if(filename.includes('head')) this.image.src = '../../images/game/characters/head/' + filename + '.png';
    if(filename.includes('chest')) { this.image.src = '../../images/game/characters/chest/' + filename + '.png';}
    if(filename.includes('legs')) { this.image.src = '../../images/game/characters/pants/' + filename + '.png';}
    if(filename.includes('shoes')) this.image.src = '../../images/game/characters/shoes/' + filename + '.png';

    if(filename.includes('ground')) this.image.src = '../../images/game/maps/ground/' + filename + '.png';
    if(filename.includes('deco')) this.image.src = '../../images/game/maps/deco/' + filename + '.png';
    if(filename.includes('collectible')) {this.image.src = '../../images/game/collectible/' + filename + '.png';}

    if(filename.includes('bullet')) this.image.src = '../../images/game/bullets/' + filename + '.png';
    if(filename.includes('effect')) this.image.src = '../../images/game/effects/' + filename + '.png';

    return this.image;
};
