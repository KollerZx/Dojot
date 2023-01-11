export type DeviceAttributes = {
  label: string
  type: "dynamic" | "static" | "actuator"
  value_type: "float" | "bool" | "integer" | "geo:point" | "string" 
}

export type TemplateDevice = {
  label: string,
  attrs: DeviceAttributes[]
}
