import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Plane_1: THREE.SkinnedMesh
    Plane_2: THREE.SkinnedMesh
    Bone: THREE.Bone
    Controls: THREE.Bone
  }
  materials: {
    Material: THREE.MeshStandardMaterial
    ['Material.001']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

type ActionName = 'No Action'
interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}


// type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['skinnedMesh'] | JSX.IntrinsicElements['bone']>>

const Model = (props: JSX.IntrinsicElements['group']) => {
  const { nodes, materials } = useGLTF('/test_page.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group scale={0.152}>
        <primitive object={nodes.Bone} />
        <primitive object={nodes.Controls} />
        <skinnedMesh geometry={nodes.Plane_1.geometry} material={materials.Material} skeleton={nodes.Plane_1.skeleton} />
        <skinnedMesh geometry={nodes.Plane_2.geometry} material={materials['Material.001']} skeleton={nodes.Plane_2.skeleton} />
      </group>
    </group>
  )
}

export default Model
useGLTF.preload('/test_page.glb')