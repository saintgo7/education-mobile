import * as THREE from 'three'
import { io } from 'socket.io-client'

/**
 * Virtual Classroom (VR) Solution
 * Immersive 3D learning environment using WebGL and WebXR
 */

interface VirtualAvatar {
  id: string
  userId: string
  userName: string
  position: THREE.Vector3
  rotation: THREE.Quaternion
  meshColor: number
  gesture: string
}

interface VirtualObject {
  id: string
  type: 'board' | 'model' | 'document' | 'interactive'
  position: THREE.Vector3
  rotation: THREE.Quaternion
  scale: THREE.Vector3
  content: string
}

interface VRClassroom {
  id: string
  name: string
  capacity: number
  currentStudents: number
  instructor: string
  subject: string
  description: string
  environment: 'modern_classroom' | 'ancient_rome' | 'space' | 'laboratory' | 'museum'
  objects: Map<string, VirtualObject>
  session_start: Date
  isRecording: boolean
}

class VirtualClassroomManager {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private socket: any

  private avatars: Map<string, THREE.Group> = new Map()
  private classrooms: Map<string, VRClassroom> = new Map()
  private currentAvatar: VirtualAvatar | null = null
  private currentClassroom: VRClassroom | null = null

  constructor(
    containerId: string,
    private apiBaseUrl: string = 'http://localhost:3000'
  ) {
    // Initialize Three.js scene
    const container = document.getElementById(containerId) as HTMLElement
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x1a1a2e)

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 1.6, 0) // Human height

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.xr.enabled = true
    container.appendChild(this.renderer.domElement)

    // Add lighting
    this.setupLighting()

    // Setup WebSocket connection
    this.socket = io(apiBaseUrl)
    this.setupSocketListeners()

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize())

    // Start animation loop
    this.animate()
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    // Point light (classroom lighting)
    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.set(0, 5, 0)
    this.scene.add(pointLight)
  }

  private setupSocketListeners(): void {
    // Join classroom
    this.socket.on('classroom:joined', (data: any) => {
      this.onClassroomJoined(data)
    })

    // User joined classroom
    this.socket.on('user:joined', (data: any) => {
      this.addAvatarToScene(data)
    })

    // User left classroom
    this.socket.on('user:left', (userId: string) => {
      this.removeAvatarFromScene(userId)
    })

    // Avatar position/rotation update
    this.socket.on('avatar:update', (data: any) => {
      this.updateAvatarPosition(data)
    })

    // Object added to classroom
    this.socket.on('object:added', (data: any) => {
      this.addObjectToScene(data)
    })

    // Object removed from classroom
    this.socket.on('object:removed', (objectId: string) => {
      this.removeObjectFromScene(objectId)
    })

    // Teacher gesture
    this.socket.on('gesture:performed', (data: any) => {
      this.playGesture(data.userId, data.gesture)
    })

    // Chat message (display above avatar)
    this.socket.on('message:sent', (data: any) => {
      this.displayChatMessage(data.userId, data.message)
    })
  }

  // Create or join classroom
  async joinClassroom(classroomId: string, userId: string, userName: string): Promise<void> {
    try {
      // Request to join classroom
      const response = await fetch(`${this.apiBaseUrl}/classrooms/${classroomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName })
      })

      const classroom = await response.json()
      this.currentClassroom = classroom

      // Create user avatar
      this.currentAvatar = {
        id: `avatar_${userId}`,
        userId,
        userName,
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Quaternion(),
        meshColor: this.getRandomColor(),
        gesture: 'idle'
      }

      // Setup classroom environment
      this.setupClassroomEnvironment(classroom)

      // Emit join event through socket
      this.socket.emit('classroom:join', {
        classroomId,
        userId,
        userName,
        avatar: this.currentAvatar
      })

      console.log(`Joined classroom: ${classroom.name}`)
    } catch (error) {
      console.error('Failed to join classroom:', error)
    }
  }

  private setupClassroomEnvironment(classroom: VRClassroom): void {
    // Clear previous environment
    this.scene.clear()
    this.setupLighting() // Re-add lighting

    // Load environment based on type
    switch (classroom.environment) {
      case 'modern_classroom':
        this.createModernClassroom()
        break
      case 'ancient_rome':
        this.createAncientRomeEnvironment()
        break
      case 'space':
        this.createSpaceEnvironment()
        break
      case 'laboratory':
        this.createLaboratoryEnvironment()
        break
      case 'museum':
        this.createMuseumEnvironment()
        break
    }

    // Add floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x404040,
      roughness: 0.8
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)

    // Add whiteboard
    this.addWhiteboard()
  }

  private createModernClassroom(): void {
    // Classroom walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc })

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      wallMaterial
    )
    backWall.position.z = -10
    backWall.receiveShadow = true
    this.scene.add(backWall)

    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      wallMaterial
    )
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.x = -10
    this.scene.add(leftWall)

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      wallMaterial
    )
    rightWall.rotation.y = Math.PI / 2
    rightWall.position.x = 10
    this.scene.add(rightWall)

    // Desks (simple cubes)
    for (let i = 0; i < 5; i++) {
      const deskGeometry = new THREE.BoxGeometry(2, 0.8, 1)
      const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      const desk = new THREE.Mesh(deskGeometry, deskMaterial)
      desk.position.set(-6 + i * 3, 0.4, 5)
      desk.castShadow = true
      desk.receiveShadow = true
      this.scene.add(desk)
    }
  }

  private createAncientRomeEnvironment(): void {
    // Colosseum-inspired environment
    const columnGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 32)
    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4a574,
      roughness: 0.7
    })

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x = Math.cos(angle) * 12
      const z = Math.sin(angle) * 12

      const column = new THREE.Mesh(columnGeometry, columnMaterial)
      column.position.set(x, 4, z)
      column.castShadow = true
      this.scene.add(column)
    }

    // Add arches (simplified with boxes)
    const archMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0826d,
      roughness: 0.8
    })

    for (let i = 0; i < 4; i++) {
      const arch = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 0.3),
        archMaterial
      )
      arch.position.set(-6 + i * 4, 6, 0)
      this.scene.add(arch)
    }
  }

  private createSpaceEnvironment(): void {
    // Space theme with stars and planets
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 1000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200
      positions[i + 1] = (Math.random() - 0.5) * 200
      positions[i + 2] = (Math.random() - 0.5) * 200
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true
    })

    const starField = new THREE.Points(starGeometry, starMaterial)
    this.scene.add(starField)

    // Add planets
    const planetGeometry = new THREE.SphereGeometry(2, 32, 32)

    const planets = [
      { color: 0xff0000, position: [-20, 0, 0] }, // Mars
      { color: 0xffff00, position: [0, 20, 0] },   // Sun
      { color: 0x0000ff, position: [20, 0, 0] }    // Neptune
    ]

    planets.forEach(planet => {
      const material = new THREE.MeshStandardMaterial({ color: planet.color })
      const mesh = new THREE.Mesh(planetGeometry, material)
      mesh.position.set(...planet.position as any)
      mesh.castShadow = true
      this.scene.add(mesh)
    })
  }

  private createLaboratoryEnvironment(): void {
    // Lab benches
    const benchGeometry = new THREE.BoxGeometry(4, 1, 2)
    const benchMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3
    })

    for (let i = 0; i < 3; i++) {
      const bench = new THREE.Mesh(benchGeometry, benchMaterial)
      bench.position.set(-5 + i * 5, 0.5, 0)
      bench.castShadow = true
      bench.receiveShadow = true
      this.scene.add(bench)
    }

    // Equipment (simplified spheres and cylinders)
    for (let i = 0; i < 6; i++) {
      const equipment = new THREE.Mesh(
        Math.random() > 0.5
          ? new THREE.SphereGeometry(0.3, 16, 16)
          : new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
      )
      equipment.position.set(
        -6 + Math.random() * 12,
        1.5,
        -2 + Math.random() * 4
      )
      equipment.castShadow = true
      this.scene.add(equipment)
    }
  }

  private createMuseumEnvironment(): void {
    // Museum-style displays with pedestals
    const pedestalGeometry = new THREE.BoxGeometry(1, 1.5, 1)
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.6
    })

    for (let i = 0; i < 4; i++) {
      const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial)
      pedestal.position.set(-6 + i * 4, 0.75, 0)
      pedestal.castShadow = true
      pedestal.receiveShadow = true
      this.scene.add(pedestal)

      // Add artifact on pedestal
      const artifact = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffd700,
          emissive: 0xffaa00
        })
      )
      artifact.position.y = 1.7
      artifact.castShadow = true
      pedestal.add(artifact)
    }
  }

  private addWhiteboard(): void {
    const whiteboardGeometry = new THREE.PlaneGeometry(8, 6)
    const whiteboardMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1
    })

    const whiteboard = new THREE.Mesh(whiteboardGeometry, whiteboardMaterial)
    whiteboard.position.set(0, 5, -9.9)
    whiteboard.receiveShadow = true
    whiteboard.userData.type = 'whiteboard'
    this.scene.add(whiteboard)
  }

  // Add avatar to scene
  private addAvatarToScene(avatarData: VirtualAvatar): void {
    const avatarGroup = new THREE.Group()

    // Head
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: avatarData.meshColor
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.6
    head.castShadow = true
    avatarGroup.add(head)

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 32)
    const body = new THREE.Mesh(bodyGeometry, headMaterial)
    body.position.y = 0.8
    body.castShadow = true
    avatarGroup.add(body)

    // Name label
    const nameLabel = this.createTextLabel(avatarData.userName)
    nameLabel.position.y = 2.0
    avatarGroup.add(nameLabel)

    avatarGroup.position.copy(avatarData.position)
    avatarGroup.quaternion.copy(avatarData.rotation)
    avatarGroup.userData = { userId: avatarData.userId }

    this.scene.add(avatarGroup)
    this.avatars.set(avatarData.userId, avatarGroup)
  }

  // Update avatar position
  private updateAvatarPosition(data: {
    userId: string
    position: any
    rotation: any
  }): void {
    const avatar = this.avatars.get(data.userId)
    if (avatar) {
      avatar.position.copy(data.position)
      avatar.quaternion.copy(data.rotation)
    }
  }

  // Remove avatar from scene
  private removeAvatarFromScene(userId: string): void {
    const avatar = this.avatars.get(userId)
    if (avatar) {
      this.scene.remove(avatar)
      this.avatars.delete(userId)
    }
  }

  // Add virtual object to scene
  private addObjectToScene(objectData: VirtualObject): void {
    let geometry: THREE.BufferGeometry

    switch (objectData.type) {
      case 'board':
        geometry = new THREE.PlaneGeometry(4, 3)
        break
      case 'model':
        geometry = new THREE.BoxGeometry(1, 1, 1)
        break
      default:
        geometry = new THREE.SphereGeometry(0.5, 32, 32)
    }

    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.copy(objectData.position)
    mesh.quaternion.copy(objectData.rotation)
    mesh.scale.copy(objectData.scale)
    mesh.userData = { objectId: objectData.id }

    this.scene.add(mesh)
  }

  // Remove virtual object from scene
  private removeObjectFromScene(objectId: string): void {
    this.scene.traverse((obj) => {
      if (obj.userData.objectId === objectId) {
        this.scene.remove(obj)
      }
    })
  }

  // Play gesture animation
  private playGesture(userId: string, gesture: string): void {
    const avatar = this.avatars.get(userId)
    if (avatar) {
      // Animate gesture
      console.log(`${userId} performed gesture: ${gesture}`)
    }
  }

  // Display chat message above avatar
  private displayChatMessage(userId: string, message: string): void {
    const avatar = this.avatars.get(userId)
    if (avatar) {
      const label = this.createTextLabel(message)
      label.position.y = 2.5
      avatar.add(label)

      // Remove after 3 seconds
      setTimeout(() => {
        avatar.remove(label)
      }, 3000)
    }
  }

  // Utility: Create text label
  private createTextLabel(text: string): THREE.Group {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64

    const context = canvas.getContext('2d')!
    context.fillStyle = 'rgba(0, 0, 0, 0.7)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.font = 'Bold 20px Arial'
    context.fillStyle = 'rgba(255, 255, 255, 1)'
    context.textAlign = 'center'
    context.fillText(text, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5), material)

    return new THREE.Group().add(mesh)
  }

  // Animation loop
  private animate = (): void => {
    requestAnimationFrame(this.animate)

    // Update avatar position from user input
    if (this.currentAvatar) {
      this.updateUserPosition()
      this.emitAvatarUpdate()
    }

    this.renderer.render(this.scene, this.camera)
  }

  // Update user position based on keyboard/XR input
  private updateUserPosition(): void {
    const keys = this.getKeyState()
    const moveSpeed = 0.1

    if (keys['w']) this.camera.position.z -= moveSpeed
    if (keys['s']) this.camera.position.z += moveSpeed
    if (keys['a']) this.camera.position.x -= moveSpeed
    if (keys['d']) this.camera.position.x += moveSpeed

    if (this.currentAvatar) {
      this.currentAvatar.position = new THREE.Vector3(
        this.camera.position.x,
        this.camera.position.y - 1.6,
        this.camera.position.z
      )
    }
  }

  // Emit avatar update to other users
  private emitAvatarUpdate(): void {
    if (this.currentAvatar) {
      this.socket.emit('avatar:update', {
        userId: this.currentAvatar.userId,
        position: this.currentAvatar.position,
        rotation: this.currentAvatar.rotation
      })
    }
  }

  // Get keyboard state
  private keyState: Record<string, boolean> = {}

  private getKeyState(): Record<string, boolean> {
    if (!this.keyState['initialized']) {
      document.addEventListener('keydown', (e) => {
        this.keyState[e.key.toLowerCase()] = true
      })

      document.addEventListener('keyup', (e) => {
        this.keyState[e.key.toLowerCase()] = false
      })

      this.keyState['initialized'] = true
    }

    return this.keyState
  }

  // Utility: Get random color
  private getRandomColor(): number {
    return Math.floor(Math.random() * 16777215)
  }

  // Handle window resize
  private onWindowResize(): void {
    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private onClassroomJoined(data: VRClassroom): void {
    console.log(`Successfully joined classroom: ${data.name}`)
    console.log(`Current students: ${data.currentStudents}/${data.capacity}`)
  }
}

export default VirtualClassroomManager
export { VirtualAvatar, VirtualObject, VRClassroom }
