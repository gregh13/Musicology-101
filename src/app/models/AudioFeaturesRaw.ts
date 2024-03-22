export default interface AudioFeaturesRaw {
    [index: string]: number,
    key: number,
    mode: number,
    tempo: number,
    energy: number,
    valence: number
}