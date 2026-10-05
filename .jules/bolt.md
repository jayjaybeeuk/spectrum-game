## 2023-10-24 - React.memo on Children Array
**Learning:** Using React.memo on a component wrapper that receives a dynamically generated children array (e.g. `GAMES.map`) is ineffective because the array reference changes on every render.
**Action:** Extract static option maps outside the component or use `useMemo` so that the `children` prop maintains referential equality.
