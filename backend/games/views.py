from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import JsonResponse


def get_video_games(request):
    search_query = request.GET.get('search', '')  # Get search query from request parameters

    # SPARQL query to retrieve video games' id, title, releaseDate, averageUserRating, assets, and hasImage
    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/game#>

        SELECT ?game ?id ?title ?description ?releaseDate ?averageUserRating ?assets ?hasImage WHERE {
          ?game rdf:type game:Game .
          ?game game:id ?id .
          ?game game:title ?title .
          ?game game:description ?description .
          ?game game:releaseDate ?releaseDate .
          ?game game:averageUserRating ?averageUserRating .
          ?game game:assets ?assets .
          OPTIONAL { ?game game:hasImage ?hasImage . }
          FILTER (REGEX(?title, "%s", "i") || REGEX(?description, "%s", "i"))
        }
    """ % (search_query, search_query)  # Inject search query into SPARQL FILTER

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    games_data = []
    for result in results["results"]["bindings"]:
        game = {
            "id": int(result["id"]["value"]),
            "title": result["title"]["value"],
            "description": result["description"]["value"],
            "releaseDate": result["releaseDate"]["value"],
            "averageUserRating": float(result["averageUserRating"]["value"]),
            "assets": result["assets"]["value"],
            "hasImage": result.get("hasImage", {}).get("value", None)
        }
        games_data.append(game)

    return JsonResponse(games_data, safe=False)


def get_best_players(request):
    # SPARQL query to retrieve players with earnings greater than 0 and their details
    sparql_query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/game#>
        PREFIX person: <http://www.semanticweb.org/video-games#>

        SELECT ?gameId ?title ?bestPlayer ?playerName ?earnings ?image ?bestAchievement ?socialLink WHERE {
           ?game rdf:type game:Game .
           ?game game:id ?gameId .
           ?game game:title ?title .
           ?game game:bestPlayer ?bestPlayer .
           ?bestPlayer rdf:type person:Player .
           ?bestPlayer person:name ?playerName .
           ?bestPlayer person:earnings ?earnings .
           ?bestPlayer person:image ?image .
           ?bestPlayer person:bestAchievement ?bestAchievement .
           ?bestPlayer person:socialLink ?socialLink .
        }
        ORDER BY DESC(?earnings)
    """

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    players_data = []
    for result in results["results"]["bindings"]:
        player = {
            "gameId": result["gameId"]["value"],
            "title": result["title"]["value"],
            "bestPlayerName": result["playerName"]["value"],
            "earnings": float(result["earnings"]["value"]),
            "image": result["image"]["value"],
            "bestAchievement": result["bestAchievement"]["value"],
            "socialLink": result["socialLink"]["value"]
        }
        players_data.append(player)

    return JsonResponse(players_data, safe=False)


def get_game_details(request, game_id):
    if game_id is None:
        return JsonResponse({"error": "Invalid game ID"}, status=400)

    # SPARQL query to retrieve detailed information about a specific game
    sparql_query = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/game#>
        PREFIX person: <http://www.semanticweb.org/video-games#>
        PREFIX platform: <http://www.semanticweb.org/platform#>
        PREFIX genre: <http://www.semanticweb.org/genre#>
        PREFIX character: <http://www.semanticweb.org/character#>
        PREFIX review: <http://www.semanticweb.org/review#>

        SELECT ?title ?description ?releaseDate ?averageUserRating ?assets ?hasImage
               ?developerName ?developerHeadquarters
               ?platformName ?platformReleaseDate
               ?genreName
               ?characterName ?characterDescription
               ?userReviewText
        WHERE {
            ?game rdf:type game:Game .
            ?game game:id ?id .
            FILTER (?id = %s)  # Filter by game ID

            # Retrieve game details
            ?game game:title ?title .
            ?game game:description ?description .
            ?game game:releaseDate ?releaseDate .
            ?game game:averageUserRating ?averageUserRating .
            ?game game:assets ?assets .
            OPTIONAL { ?game game:hasImage ?hasImage . }

            # Retrieve developer details (optional)
            OPTIONAL {
                ?game game:developedBy ?developer .
                ?developer rdf:type person:Developer .
                ?developer person:name ?developerName .
                ?developer person:headquarters ?developerHeadquarters .
            }

            # Retrieve platform details (optional)
            OPTIONAL {
                ?game game:availableOn ?platform .
                ?platform rdf:type platform:Platform .
                ?platform platform:name ?platformName .
                ?platform platform:releaseDate ?platformReleaseDate .
            }

            # Retrieve genre details (optional)
            OPTIONAL {
                ?game game:belongsToGenre ?genre .
                ?genre rdf:type genre:Genre .
                ?genre genre:name ?genreName .
            }

            # Retrieve character details (optional)
            OPTIONAL {
                ?game game:appearsInGame ?character .
                ?character rdf:type character:Character .
                ?character character:name ?characterName .
                ?character character:description ?characterDescription .
            }

            # Retrieve user review text (optional)
            OPTIONAL {
                ?game game:hasUserReview ?userReview .
                ?userReview rdf:type review:UserReview .
                ?userReview review:reviewedGame ?game .
                ?userReview review:reviewText ?userReviewText .
            }
        }
    """ % game_id  # Inject game ID into SPARQL FILTER

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    game_details = {}
    for result in results["results"]["bindings"]:
        game_details = {
            "title": result["title"]["value"],
            "description": result["description"]["value"],
            "releaseDate": result["releaseDate"]["value"],
            "averageUserRating": float(result["averageUserRating"]["value"]),
            "assets": result["assets"]["value"],
            "hasImage": result.get("hasImage", {}).get("value", None),
            "developerName": result.get("developerName", {}).get("value", None),
            "developerHeadquarters": result.get("developerHeadquarters", {}).get("value", None),
            "platformName": result.get("platformName", {}).get("value", None),
            "platformReleaseDate": result.get("platformReleaseDate", {}).get("value", None),
            "genreName": result.get("genreName", {}).get("value", None),
            "characterName": result.get("characterName", {}).get("value", None),
            "characterDescription": result.get("characterDescription", {}).get("value", None),
            "userReviewText": result.get("userReviewText", {}).get("value", None)
        }

    if not game_details:
        return JsonResponse({"error": "Game details not found"}, status=404)

    return JsonResponse(game_details, safe=False)
