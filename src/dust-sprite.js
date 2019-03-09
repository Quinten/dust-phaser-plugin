import Phaser from "phaser";

class DustSprite extends Phaser.GameObjects.Image
{
    constructor(scene, x, y)
    {
        super(scene, x, y, "dust");

        this.scene = scene;
        scene.add.existing(this);
        scene.events.on("update", this.update, this);
        scene.events.once("shutdown", this.destroy, this);

        this.behavior = {};
        this.behavior.position = new Phaser.Math.Vector2(x, y);
        this.behavior.steeringForce = new Phaser.Math.Vector2(0, 0);
        this.behavior.maxForce = 1;
        this.behavior.mass = 1;
        this.behavior.velocity = new Phaser.Math.Vector2(0, 0);
        this.behavior.maxSpeed = 1;
        this.behavior.wanderDistance = 10;
        this.behavior.wanderRadius = 5;
        this.behavior.wanderAngle = 0;
        this.behavior.wanderRange = 0.5;
        this.behavior.cameraPosition = this.scene.cameras.main.midPoint.clone();
    }

    update(time, deltaTime)
    {
        let _ = this.behavior;
        let center = _.velocity.clone().normalize().multiply(new Phaser.Math.Vector2(_.wanderDistance, _.wanderDistance));
        let offset = new Phaser.Math.Vector2(1, 0);
        offset.normalize().multiply(new Phaser.Math.Vector2(_.wanderRadius, _.wanderRadius));
        let len = offset.length();
        offset.x = Math.cos(_.wanderAngle) * len;
        offset.y = Math.sin(_.wanderAngle) * len;
        _.wanderAngle += Math.random() * _.wanderRange - _.wanderRange * .5;
        let force = center.add(offset);
        _.steeringForce = _.steeringForce.add(force);

        // steering
        if (_.steeringForce.lengthSq() > _.maxForce * _.maxForce) {
            _.steeringForce.normalize().multiply(new Phaser.Math.Vector2(_.maxForce, _.maxForce));
        }
        _.steeringForce = _.steeringForce.divide(new Phaser.Math.Vector2(_.mass, _.mass));
        _.velocity = _.velocity.add(_.steeringForce);
        _.steeringForce = new Phaser.Math.Vector2(0, 0);

        // velocity
        if (_.velocity.lengthSq() > _.maxSpeed * _.maxSpeed) {
            _.velocity.normalize().multiply(new Phaser.Math.Vector2(_.maxSpeed, _.maxSpeed));
        }
        _.position = _.position.add(_.velocity);

        // subtract camera velocity
        let newCameraPosition = this.scene.cameras.main.midPoint.clone();
        let cameraVelocity = newCameraPosition.clone().subtract(_.cameraPosition);
        _.cameraPosition = newCameraPosition;
        _.position = _.position.subtract(cameraVelocity);

        // wrapping
        if (_.position.x > this.scene.cameras.main.width) _.position.x = 0;
        if (_.position.x < 0) _.position.x = this.scene.cameras.main.width;
        if (_.position.y > this.scene.cameras.main.height) _.position.y = 0;
        if (_.position.y < 0) _.position.y = this.scene.cameras.main.height;

        // set position
        this.x = _.position.x;
        this.y = _.position.y;

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
