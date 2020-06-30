import Library from "@library/Library"

describe('Library class', () => {
  let library: Library | null

  beforeAll(async done => {
    library = new Library('some param')

		done()
	})

	afterAll(() => {
		library = null
	})

  test('some arbitrary test', async () => {
    expect(library?.parameterOne).toEqual('some param')
  })
})
