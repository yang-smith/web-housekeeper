import * as THREE from 'three'

import Experience from './Experience.js'

export default class Screen
{
    constructor(_mesh, _sourcePath)
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.world = this.experience.world

        this.mesh = _mesh
        this.sourcePath = _sourcePath

        this.setModel()
    }

    setModel()
    {
        this.model = {}

        // Element
        this.model.element = document.createElement('video')
        this.model.element.muted = true
        this.model.element.loop = true
        this.model.element.controls = true
        this.model.element.playsInline = true
        this.model.element.autoplay = true
        this.model.element.src = this.sourcePath
        this.model.element.play()

        // Texture
        this.model.texture = new THREE.VideoTexture(this.model.element)
        this.model.texture.encoding = THREE.sRGBEncoding

        // Material
        this.model.material = new THREE.MeshBasicMaterial({
            map: this.model.texture
        })

        // Mesh
        this.model.mesh = this.mesh
        this.model.mesh.material = this.model.material
        this.scene.add(this.model.mesh)
    }

    changeVideoSource(newSourcePath) {
        // Pause and remove the current video
        this.model.element.pause();
        this.model.element.src = '';
        this.model.element.load();
    
        // Set up and play the new video
        this.model.element.src = newSourcePath;
        this.model.element.play();
    
        // Update the texture
        if (this.model.texture) {
            this.model.texture.dispose();
        }
        this.model.texture = new THREE.VideoTexture(this.model.element);
        this.model.material.map = this.model.texture;
    }
    
    stopVideo() {
        // Pause the current video
        this.model.element.pause();
    
        // Remove the current video source
        this.model.element.src = '';
        this.model.element.load();
    
        // Clear the texture and material map
        this.model.texture.dispose();
        this.model.texture = null;
        this.model.material.map = null;
    }
    
    update()
    {
        // this.model.group.rotation.y = Math.sin(this.time.elapsed * 0.0005) * 0.5
    }
}