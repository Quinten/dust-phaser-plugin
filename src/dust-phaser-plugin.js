import Phaser from "phaser";

class DustPhaserPlugin extends Phaser.Plugins.ScenePlugin
{
    constructor(scene, pluginManager)
    {
        super(scene, pluginManager);

        this.scene = scene;
        this.systems = scene.sys;

        if (!this.systems.settings.isBooted) {
            this.systems.events.once("boot", this.boot, this);
        }
    }

    start()
    {
        console.log('DustPhaserPlugin started...');
    }

    boot()
    {
        this.systems.events.once("destroy", this.destroy, this);

        console.log('DustPhaserPlugin booted...');
    }

    destroy()
    {
        this.systems.events.off("boot", this.boot, this);

        this.scene = undefined;
        this.systems = undefined;

        console.log('DustPhaserPlugin destroyed...');
    }
}

export default DustPhaserPlugin;
