import ItemMesh from "./ItemMesh"

export default function ItemsMesh({ engine }) {
  const state = engine.getState()

  return (
    <>
      {state.items.map(item => (
        <ItemMesh
          key={item.instanceId}
          item={item}
          world={state.world}
        />
      ))}
    </>
  )
}