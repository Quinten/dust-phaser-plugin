import Phaser from 'phaser';

class DustSprite extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'dust');

        this.scene = scene;
        scene.add.existing(this);
        scene.events.on('update', this.update, this);
        scene.events.once('shutdown', this.destroy, this);

        this.behavior = {};
        this.behavior.position = new Phaser.Math.Vector2(x, y);
        this.behavior.steeringForce = new Phaser.Math.Vector2(0, 0);
        this.behavior.velocity = new Phaser.Math.Vector2(0, 0);
        this.behavior.wanderAngle = 0;

        this.behavior.maxForce = 1;
        this.behavior.mass = 1;
        this.behavior.maxSpeed = 1;
        this.behavior.wanderDistance = 10;
        this.behavior.wanderRadius = 5;
        this.behavior.wanderRange = 0.5;

        this.behavior.consts = ["maxForce", "mass", "maxSpeed", "wanderDistance", "wanderRadius", "wanderRange"];

        this.behavior.cameraPosition = this.scene.cameras.main.midPoint.clone();
    }

    update(time, deltaTime)
    {
        let factor = deltaTime / 17;
        let _ = this.behavior;
        let f = {...this.behavior};
        for (let key in f.consts) {
            f[key] = f[key] * factor;
        }
        let center = _.velocity.clone().normalize().multiply(new Phaser.Math.Vector2(f.wanderDistance, f.wanderDistance));
        let offset = new Phaser.Math.Vector2(1, 0);
        offset.normalize().multiply(new Phaser.Math.Vector2(f.wanderRadius, f.wanderRadius));
        let len = offset.length();
        offset.x = Math.cos(_.wanderAngle) * len;
        offset.y = Math.sin(_.wanderAngle) * len;
        _.wanderAngle += Math.random() * f.wanderRange - f.wanderRange * .5;
        let force = center.add(offset);
        _.steeringForce = _.steeringForce.add(force);

        // steering
        if (_.steeringForce.lengthSq() > f.maxForce * f.maxForce) {
            _.steeringForce.normalize().multiply(new Phaser.Math.Vector2(f.maxForce, f.maxForce));
        }
        _.steeringForce = _.steeringForce.divide(new Phaser.Math.Vector2(f.mass, f.mass));
        _.velocity = _.velocity.add(_.steeringForce);
        _.steeringForce = new Phaser.Math.Vector2(0, 0);

        // velocity
        if (_.velocity.lengthSq() > f.maxSpeed * f.maxSpeed) {
            _.velocity.normalize().multiply(new Phaser.Math.Vector2(f.maxSpeed, f.maxSpeed));
        }
        _.position = _.position.add(_.velocity);

        // subtract camera velocity
        let newCameraPosition = this.scene.cameras.main.midPoint.clone();
        let cameraVelocity = newCameraPosition.clone().subtract(_.cameraPosition);
        _.cameraPosition = newCameraPosition;
        _.position = _.position.subtract(cameraVelocity);

        // wrapping
        if (_.position.x > (this.scene.cameras.main.width + (this.width / 2))) {
            _.position.x = -(this.width / 2);
        }
        if (_.position.x < -(this.width / 2)) {
            _.position.x = this.scene.cameras.main.width + (this.width / 2);
        }
        if (_.position.y > (this.scene.cameras.main.height + (this.height / 2))) {
            _.position.y = -(this.height / 2);
        }
        if (_.position.y < -(this.height / 2)) {
            _.position.y = this.scene.cameras.main.height + (this.height / 2);
        }

        // set position
        this.x = _.position.x;
        this.y = _.position.y;

    }

    destroy()
    {
        if (this.scene) {
            this.scene.events.off('update', this.update, this);
        }
        super.destroy();
    }
}

export default DustSprite;
