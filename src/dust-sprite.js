import Phaser from "phaser";

class DustSprite extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "dust");
        this.scene = scene;
        scene.physics.world.enable(this);
        scene.add.existing(this);
        scene.events.on("update", this.update, this);
        scene.events.once("shutdown", this.destroy, this);
    }

    update(time, deltaTime)
    {
        if (!this.body) {
            return;
        }

        // ...
    }

    destroy()
    {
        if (this.scene) {
            this.scene.events.off("update", this.update, this);
        }
        super.destroy();
    }
}

export default DustSprite;
