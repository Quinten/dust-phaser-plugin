# dust-phaser-plugin

a Phaser 3 plugin for floating dust particles

The goal of this plugin is to provide an easy way to add 1x1 pixels that wander around the screen. This animation effect can give a little bit more life and polish to your pixelart scene.

### Install from npm

```
npm i dust-phaser-plugin
```

Phaser must also be a dependency of your project.

### Use it in your Phaser game

Add it as a scene plugin:

```
import "phaser";
import Level from "./scenes/Level.js";
import DustPhaserPlugin from "dust-phaser-plugin";

var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: "#000000",
    pixelArt: true,
    zoom: 2,
    plugins: {
        scene: [
            { key: "DustPlugin", plugin: DustPhaserPlugin, mapping: "dust" }
        ]
    },
    scene: [
        Level
    ]
};

// start game
const game = new Phaser.Game(config);
```

Then in the create method of the scene you want to add the particles to:

```
class Level extends Phaser.Scene {

    constructor (config)
    {
        super((config) ? config : { key: "level" });
    }

    create()
    {
        this.dust.addOnePixelDust({ count: 12, alpha: .85 , tint: 0xA3CB38 });
    }
}
```

This will add 12 green 1x1 pixels that wander around the camera viewport.

If you want to use your own image instead of a 1x1 pixel, you have to preload an image with the key `dust`:

```
this.load.image("dust", "assets/dust.png");
```

Then you can call `addDust` in the create method of your scene:

```
this.dust.addDust( { count: 10 } );
```

### Parameters

Both `addOnePixelDust` and `addDust` take a config object as argument with 3 optional properties:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------:|
|**`count`**|`{Integer}`|`8`|The number of particles within the camera viewport at any given time.|
|**`alpha`**|`{Number}`|`1`|A number between 0 and 1, indicating the amount of transparency of the particle.|
|**`tint`**|`{Integer}`|`0xffffff`|A tint to apply to the particle. Use a white texture for best results.|

### License

MIT
