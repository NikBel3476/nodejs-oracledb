export interface WindRoseDirectionStats {
  cardinalDirection: "E" | "NE" | "N" | "NW" | "W" | "SW" | "S" | "SE";
  hours: number;
  windGust: number;
  windSpeed: number;
}
