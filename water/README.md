# Database interaction layer for Sunday Peak

This library doesn't really need to be public facing. If you come across it, you can ignore it. For anyone working on Sunday Peak, I'm working on getting some more documentation live

## If you still care, here's how this works

- To initialize, there's a class called `SundayService`. Create an instance of this and initialize with your sql parameters and a jwt secret, then you're good to go
- There's a layer called `services` that handles all the formatting and grouping requests into a cohesive request/response
- `Services` has a few classes that handles the majority of the traffic coming to the backend
- Those send requests to the database layer: `DB/.` to store or retrieve the information from the database
- If stuff needs to be cached, that happens in `services`

### Rules to follow

- Data going to/from the database should be formatted with underscores instead of camelCase
- Stuff should usually be tested. I've gotten above 80% coverage, still need to write more sad path tests and error responses
- More design docs could be useful for this. Right now, I'm just trying to get stuff out.


**Example:**
```javascript
const serviceHandler = new SundayService(<sqlParameters>, <jwtSecret>)
const userHandlers = serviceHandler.userService
const adventureHandlers = serviceHandler.adventureService
// ...todoHandlers, messageHandlers, passwordHandlers, completedHandlers
```
