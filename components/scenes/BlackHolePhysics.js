import { useSphere } from '@react-three/cannon'

export const BlackHolePhysics = () => {
  const [ref] = useSphere(() => ({
    mass: 0,
    position: [0, 0, -8], // same as model
    args: [0.2],          // small invisible sphere
    type: 'Static',
  }))
  return <mesh ref={ref} visible={false} />
}
