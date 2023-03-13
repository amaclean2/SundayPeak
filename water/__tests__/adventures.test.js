const SundayService = require('..')
const logger = require('../Config/logger')

let creator, newAdventure, serviceHandler

describe('adventure service layer testing', () => {
  beforeAll(async () => {
    serviceHandler = new SundayService(
      {
        host: 'localhost',
        user: 'byf',
        password: 'backyard',
        database: 'test_adventures',
        port: '3306'
      },
      'secret'
    )

    await serviceHandler.createTables()

    const { user } = await serviceHandler.userService.addNewUser({
      email: 'user@123.com',
      password: 'skiing',
      confirmPassword: 'skiing',
      firstName: 'Jeremy',
      lastName: 'Clarkson'
    })

    creator = user
  })
  afterAll(async () => {
    // adding data to searchable users and searchable adventures happens asynchronously
    // not waiting to delete the tables was deleting the tables before the query could finish
    setTimeout(async () => {
      await serviceHandler.removeTables()
    }, 100)
  })
  describe('adventure happy paths', () => {
    test('can add a new adventure', async () => {
      const newAdventureResponse =
        await serviceHandler.adventureService.createAdventure({
          adventureObject: {
            adventure_type: 'ski',
            adventure_name: 'Ski Descent',
            nearest_city: 'Truckee, California',
            public: true,
            creator_id: creator.id,
            coordinates_lat: 10,
            coordinates_lng: 11
          }
        })

      expect(newAdventureResponse.adventure).toBeDefined()
      expect(newAdventureResponse.adventureList).toBeDefined()

      const { adventure, adventureList } = newAdventureResponse
      newAdventure = adventure

      expect(adventure.creator_id).toBe(creator.id)
      expect(adventure.coordinates).toBeDefined()
      expect(adventure.coordinates.lat).toBeDefined()
      expect(adventureList.type).toBe('FeatureCollection')
      expect(adventureList.features).toBeDefined()
      expect(adventureList.features.length).toBe(1)
    })

    test('can add a new climbing adventure', async () => {
      const newAdventureResponse =
        await serviceHandler.adventureService.createAdventure({
          adventureObject: {
            adventure_type: 'climb',
            adventure_name: 'My Big Climb',
            nearest_city: 'Yosemite, California',
            public: true,
            creator_id: creator.id,
            coordinates_lat: 10,
            coordinates_lng: 11
          }
        })

      expect(newAdventureResponse.adventure).toBeDefined()
      expect(newAdventureResponse.adventureList).toBeDefined()

      const { adventure, adventureList } = newAdventureResponse

      expect(adventure.creator_id).toBe(creator.id)
      expect(adventure.coordinates).toBeDefined()
      expect(adventure.coordinates.lat).toBeDefined()
      expect(adventureList.type).toBe('FeatureCollection')
      expect(adventureList.features).toBeDefined()
      expect(adventureList.features.length).toBe(1)
    })

    test('can add a new hiking adventure', async () => {
      const newAdventureResponse =
        await serviceHandler.adventureService.createAdventure({
          adventureObject: {
            adventure_type: 'hike',
            adventure_name: 'Hike Big Mountain',
            nearest_city: 'Lone Pine, California',
            public: true,
            creator_id: creator.id,
            coordinates_lat: 10,
            coordinates_lng: 11
          }
        })

      expect(newAdventureResponse.adventure).toBeDefined()
      expect(newAdventureResponse.adventureList).toBeDefined()

      const { adventure, adventureList } = newAdventureResponse

      expect(adventure.creator_id).toBe(creator.id)
      expect(adventure.coordinates).toBeDefined()
      expect(adventure.coordinates.lat).toBeDefined()
      expect(adventureList.type).toBe('FeatureCollection')
      expect(adventureList.features).toBeDefined()
      expect(adventureList.features.length).toBe(1)
    })

    test('can search for an adventure', async () => {
      // this test needs to wait until the end because it's quering against an asynchronous
      // data population
      const adventureList =
        await serviceHandler.adventureService.searchForAdventures({
          search: 'ckee cali'
        })

      setTimeout(() => {
        expect(adventureList.length).toBe(1)
      }, 100)
    })

    test('can get an adventure list', async () => {
      const adventureList =
        await serviceHandler.adventureService.getAdventureList({
          adventureType: newAdventure.adventure_type
        })

      expect(adventureList.type).toBe('FeatureCollection')
      expect(adventureList.features.length).toBe(1)

      const adventure = adventureList.features[0]

      expect(adventure.geometry?.coordinates).toBeDefined()
      expect(adventure.properties).toBeDefined()
      expect(adventure.properties.id).toBe(newAdventure.id)
    })

    test('can pull up a specific adventure', async () => {
      const myAdventure =
        await serviceHandler.adventureService.getSpecificAdventure({
          adventureId: newAdventure.id,
          adventureType: newAdventure.adventure_type
        })

      expect(myAdventure.id).toBe(newAdventure.id)
      expect(myAdventure.adventure_type).toBe(newAdventure.adventure_type)
      expect(myAdventure.creator_name).toBe(
        `${creator.first_name} ${creator.last_name}`
      )
      expect(myAdventure.public).toBe(newAdventure.public)
    })

    test("can edit an adventure's general fields", async () => {
      const newBio = 'something about this adventure'
      await serviceHandler.adventureService.editAdventure({
        field: {
          name: 'bio',
          value: newBio,
          adventure_id: newAdventure.id,
          adventure_type: newAdventure.adventure_type
        }
      })

      const adventureResponse =
        await serviceHandler.adventureService.getSpecificAdventure({
          adventureId: newAdventure.id,
          adventureType: newAdventure.adventure_type
        })

      expect(adventureResponse).toBeDefined()
      expect(adventureResponse.bio).toBe(newBio)
    })

    test("can edit an adventure's specific fields", async () => {
      const summitElevation = 8500
      await serviceHandler.adventureService.editAdventure({
        field: {
          name: 'summit_elevation',
          value: summitElevation,
          adventure_id: newAdventure.id,
          adventure_type: newAdventure.adventure_type
        }
      })

      const adventureResponse =
        await serviceHandler.adventureService.getSpecificAdventure({
          adventureId: newAdventure.id,
          adventureType: newAdventure.adventure_type
        })

      expect(adventureResponse).toBeDefined()
      expect(adventureResponse.summit_elevation).toBe(summitElevation)
    })

    test('can bulk add adventures', async () => {
      const adventures = [
        {
          adventure_type: 'ski',
          adventure_name: 'Ski Descent 2',
          nearest_city: 'New City',
          public: true,
          creator_id: creator.id,
          coordinates_lat: 12,
          coordinates_lng: 12.1
        },
        {
          adventure_type: 'ski',
          adventure_name: 'Ski Descent 3',
          nearest_city: 'New City',
          public: true,
          creator_id: creator.id,
          coordinates_lat: 12.2,
          coordinates_lng: 12.05
        },
        {
          adventure_type: 'hike',
          adventure_name: 'Hiking Trail',
          nearest_city: 'New City',
          public: true,
          creator_id: creator.id,
          coordinates_lat: 10.2,
          coordinates_lng: 12.1
        },
        {
          adventure_type: 'climb',
          adventure_name: 'Big Mountain',
          nearest_city: 'New City',
          public: true,
          creator_id: creator.id,
          coordinates_lat: 11.2,
          coordinates_lng: 12.5
        }
      ]

      const bulkInsertResponse =
        await serviceHandler.adventureService.bulkAdventureCreation({
          adventures
        })

      expect(bulkInsertResponse.length).toBe(4)
      expect(bulkInsertResponse[0].id).toBeDefined()
      expect(bulkInsertResponse[0].adventure_type).toBeDefined()

      const adventureList =
        await serviceHandler.adventureService.getAdventureList({
          adventureType: 'ski'
        })

      expect(adventureList?.features?.length).toBe(3)
    })

    test('can delete an adventure', async () => {
      const adventureDetails = {
        id: newAdventure.id,
        type: newAdventure.adventure_type
      }

      const deletionResponse =
        await serviceHandler.adventureService.deleteAdventure({
          adventureId: adventureDetails.id,
          adventureType: adventureDetails.type
        })

      expect(deletionResponse?.affectedRows).toBe(1)

      await serviceHandler.adventureService
        .getSpecificAdventure({
          adventureId: adventureDetails.id,
          adventureType: adventureDetails.type
        })
        .catch((error) => {
          expect(error).toBe(`adventure couldn't be found`)
        })
    })
  })
  describe('adventure sad paths', () => {
    test("if a request for an adventure doesn't have an id or type field it is rejected", async () => {
      try {
        await serviceHandler.adventureService.getSpecificAdventure({
          adventureId: newAdventure.id,
          adventureType: null
        })
      } catch (error) {
        expect(error).toBe(
          'The adventureId and adventureType fields are required to be non-falsy. Please supply the missing field(s).'
        )
      }
    })
  })
})
