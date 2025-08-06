import { useSphere } from '@react-three/cannon'

export const BlackHolePhysics = () => {
  const [ref] = useSphere(() => ({
    mass: 0,
    position: [0, 0, -8],
    args: [0.2],   
    type: 'Static',
  }))
  return <mesh ref={ref} visible={false} />
}
