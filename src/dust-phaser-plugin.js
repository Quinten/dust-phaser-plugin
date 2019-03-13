import Phaser from 'phaser';
import DustSprite from './dust-sprite';

class DustPhaserPlugin extends Phaser.Plugins.ScenePlugin
{
    constructor(scene, pluginManager)
    {
        super(scene, pluginManager);

        this.scene = scene;
        this.systems = scene.sys;

        if (!this.systems.settings.isBooted) {
            this.systems.events.once('boot', this.boot, this);
        }
    }

    addOnePixelDust({
        count = 8,
        alpha = 1,
        tint = 0xffffff
    } = {})
    {
        if (!this.systems.textures.exists('dust')) {
            this.systems.textures.once('addtexture', () => {
                this.addDust({count, alpha, tint});
            });
            this.systems.textures.addBase64('dust', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=');
        } else {
            this.addDust({count, alpha, tint});
        }
    }

    addDust({
        count = 8,
        alpha = 1,
        tint = 0xffffff
    } = {})
    {
        let dusts = [];
        for (let d = 0; d < count; d++) {
            let dust = new DustSprite(this.scene, Math.floor(Math.random() * this.scene.cameras.main.width), Math.floor(Math.random() * this.scene.cameras.main.height));
            dust.alpha = alpha;
            dust.tint = tint;
            dusts.push(dust);
        }
        let container = this.scene.add.container(0, 0, dusts);
        container.setScrollFactor(0);
    }

    boot()
    {
        this.systems.events.once('destroy', this.destroy, this);

        //console.log('DustPhaserPlugin booted...');
    }

    destroy()
    {
        this.systems.events.off('boot', this.boot, this);

        this.scene = undefined;
        this.systems = undefined;

        //console.log('DustPhaserPlugin destroyed...');
    }
}

export default DustPhaserPlugin;
