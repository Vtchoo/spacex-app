import axios from "axios"

interface PaginatedResponse<T> {
    docs: T[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number
    nextPage: number
}

interface Launch {
    id: string

    fairings: null
    links: {
        patch: {
            small: string
            large: string
        }
        reddit: {
            campaign: string
            launch: string
            media: string
            recovery: string
        }
        flickr: {
            small: string[]
            original: string[]
        },
        presskit: string
        webcast: string
        youtube_id: string
        article: string
        wikipedia: string
    }
    static_fire_date_utc: string
    static_fire_date_unix: number
    tdb: boolean
    net: boolean
    window: number
    rocket: string
    success: boolean
    failures: string[]
    details: string
    crew: string[]
    ships: string[]
    capsules: string[]
    payloads: string[]
    launchpad: string
    auto_update: boolean
    flight_number: number
    name: string
    date_utc: string
    date_unix: number
    date_local: string
    date_precision: string
    upcoming: boolean

}

class SpaceX {
    
    static readonly baseUrl = 'https://api.spacexdata.com'
    static readonly version = 'v4'

    static async getNextLaunch() {
        const { data } = await axios.get<Launch>(`${this.baseUrl}/${this.version}/launches/next`)
        return data
    }

    static async queryLaunches(query: any, options?: any) {

        const body = { query } as any
        if (options) body.options = options

        const { data } = await axios.post<PaginatedResponse<Launch>>(`${this.baseUrl}/${this.version}/launches/query`, body)
        return data
    }

    static async getLaunchById(id: string) {
        const { data } = await axios.get<Launch>(`${this.baseUrl}/${this.version}/launches/${id}`)
        return data
    }

}

export type { Launch }
export default SpaceX

// {
//     "fairings": null,
//     "links": {
//         "patch": {
//             "small": "https://images2.imgbox.com/53/22/dh0XSLXO_o.png",
//             "large": "https://images2.imgbox.com/15/2b/NAcsTEB6_o.png"
//         },
//         "reddit": {
//             "campaign": "https://www.reddit.com/r/spacex/comments/ezn6n0/crs20_launch_campaign_thread",
//             "launch": "https://www.reddit.com/r/spacex/comments/fe8pcj/rspacex_crs20_official_launch_discussion_updates/",
//             "media": "https://www.reddit.com/r/spacex/comments/fes64p/rspacex_crs20_media_thread_videos_images_gifs/",
//             "recovery": null
//         },
//         "flickr": {
//             "small": [],
//             "original": [
//                 "https://live.staticflickr.com/65535/49635401403_96f9c322dc_o.jpg",
//                 "https://live.staticflickr.com/65535/49636202657_e81210a3ca_o.jpg",
//                 "https://live.staticflickr.com/65535/49636202572_8831c5a917_o.jpg",
//                 "https://live.staticflickr.com/65535/49635401423_e0bef3e82f_o.jpg",
//                 "https://live.staticflickr.com/65535/49635985086_660be7062f_o.jpg"
//             ]
//         },
//         "presskit": "https://www.spacex.com/sites/spacex/files/crs-20_mission_press_kit.pdf",
//         "webcast": "https://youtu.be/1MkcWK2PnsU",
//         "youtube_id": "1MkcWK2PnsU",
//         "article": "https://spaceflightnow.com/2020/03/07/late-night-launch-of-spacex-cargo-ship-marks-end-of-an-era/",
//         "wikipedia": "https://en.wikipedia.org/wiki/SpaceX_CRS-20"
//     },
//     "static_fire_date_utc": "2020-03-01T10:20:00.000Z",
//     "static_fire_date_unix": 1583058000,
//     "tdb": false,
//     "net": false,
//     "window": 0,
//     "rocket": "5e9d0d95eda69973a809d1ec",
//     "success": true,
//     "failures": [],
//     "details": "SpaceX's 20th and final Crew Resupply Mission under the original NASA CRS contract, this mission brings essential supplies to the International Space Station using SpaceX's reusable Dragon spacecraft. It is the last scheduled flight of a Dragon 1 capsule. (CRS-21 and up under the new Commercial Resupply Services 2 contract will use Dragon 2.) The external payload for this mission is the Bartolomeo ISS external payload hosting platform. Falcon 9 and Dragon will launch from SLC-40, Cape Canaveral Air Force Station and the booster will land at LZ-1. The mission will be complete with return and recovery of the Dragon capsule and down cargo.",
//     "crew": [],
//     "ships": [],
//     "capsules": [
//         "5e9e2c5cf359185d753b266f"
//     ],
//     "payloads": [
//         "5eb0e4d0b6c3bb0006eeb253"
//     ],
//     "launchpad": "5e9e4501f509094ba4566f84",
//     "auto_update": true,
//     "flight_number": 91,
//     "name": "CRS-20",
//     "date_utc": "2020-03-07T04:50:31.000Z",
//     "date_unix": 1583556631,
//     "date_local": "2020-03-06T23:50:31-05:00",
//     "date_precision": "hour",
//     "upcoming": false,
//     "cores": [
//         {
//             "core": "5e9e28a7f359187afd3b2662",
//             "flight": 2,
//             "gridfins": true,
//             "legs": true,
//             "reused": true,
//             "landing_attempt": true,
//             "landing_success": true,
//             "landing_type": "RTLS",
//             "landpad": "5e9e3032383ecb267a34e7c7"
//         }
//     ],
//     "id": "5eb87d42ffd86e000604b384"
// }