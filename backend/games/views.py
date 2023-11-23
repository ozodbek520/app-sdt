from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import JsonResponse


# get video games lit
def get_video_games(request):
    search_query = request.GET.get('search', '')  # Get search query from request parameters
    page = int(request.GET.get('page', 1))  # Get current page number from request, default is 1
    limit = 25  # Number of items per page
    offset = (page - 1) * limit  # Calculate offset

    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?Id ?Title ?CoverURL ?Summary ?Top ?ReleaseDate ?Ranking ?TimesListed ?NumberOfReviews WHERE {
          ?x game:Id ?IdString .
          BIND(xsd:integer(?IdString) AS ?Id)
          ?x game:Title ?Title .
          ?x game:CoverURL ?CoverURL .
          ?x game:TrailerURL ?TrailerURL .
          ?x game:Summary ?Summary .
          ?x game:Top ?Top .
          ?x game:ReleaseDate ?ReleaseDate .
          ?x game:Ranking ?Ranking .
          ?x game:TimesListed ?TimesListed .
          ?x game:NumberOfReviews ?NumberOfReviews .
          FILTER (REGEX(?Title, "%s", "i") || REGEX(?Summary, "%s", "i"))
        } ORDER BY ?Id LIMIT %d OFFSET %d
    """ % (search_query, search_query, limit, offset)  # Inject search query into SPARQL FILTER

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    games_data = []
    for result in results["results"]["bindings"]:
        game = {
            "id": int(result["Id"]["value"]),
            "title": result["Title"]["value"],
            "coverURL": result["CoverURL"]["value"],
            "summary": result["Summary"]["value"],
            "top": result["Top"]["value"],
            "releaseDate": result["ReleaseDate"]["value"],
            "ranking": float(result["Ranking"]["value"]),
            "timesListed": result["TimesListed"]["value"],
            "numberOfReviews": result["NumberOfReviews"]["value"],
        }
        games_data.append(game)

    return JsonResponse(games_data, safe=False)


# get video game details by ID
def get_game_details(request, game_id):
    if game_id is None:
        return JsonResponse({"error": "Invalid game ID"}, status=400)

    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?Id ?Title ?CoverURL ?TrailerURL ?Summary ?Top ?ReleaseDate ?Ranking ?TimesListed ?NumberOfReviews ?PlayerName WHERE {
          ?x game:Id ?IdString .
          BIND(xsd:integer(?IdString) AS ?Id)
          ?x game:Title ?Title .
          ?x game:CoverURL ?CoverURL .
          ?x game:TrailerURL ?TrailerURL .
          ?x game:TrailerURL ?TrailerURL .
          ?x game:Summary ?Summary .
          ?x game:Top ?Top .
          ?x game:ReleaseDate ?ReleaseDate .
          ?x game:Ranking ?Ranking .
          ?x game:TimesListed ?TimesListed .
          ?x game:NumberOfReviews ?NumberOfReviews .
          ?x game:PlayerName ?PlayerName .
          FILTER(xsd:integer(?IdString) = %d)
        } ORDER BY ?Id
    """ % int(game_id)  # Inject game ID into SPARQL FILTER

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    game_data = None
    for result in results["results"]["bindings"]:
        game_data = {
            "id": int(result["Id"]["value"]),
            "title": result["Title"]["value"],
            "coverURL": result["CoverURL"]["value"],
            "trailerURL": result["TrailerURL"]["value"],
            "summary": result["Summary"]["value"],
            "top": result["Top"]["value"],
            "releaseDate": result["ReleaseDate"]["value"],
            "ranking": float(result["Ranking"]["value"]),
            "timesListed": result["TimesListed"]["value"],
            "numberOfReviews": result["NumberOfReviews"]["value"],
            "playerName": result["PlayerName"]["value"],
        }
        break  # Assuming ID is unique, break after finding the first match

    if game_data:
        return JsonResponse(game_data, safe=False)
    else:
        return JsonResponse({"error": "Game not found"}, status=404)


# get the best players list
def get_best_players(request):
    # SPARQL query to retrieve player details
    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX player: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?Id ?PlayerName ?SocialLink ?PlayerImageURL ?Prize ?PlayerGameName ?PlayerGameID WHERE {
            ?player rdf:type player:Player .
            ?player player:Id ?IdString .
            ?player player:hasPlayerDetails ?details .

            ?details player:PlayerName ?PlayerName .
            ?details player:SocialLink ?SocialLink .
            ?details player:PlayerImageURL ?PlayerImageURL .
            ?details player:Prize ?PrizeString .
            ?details player:PlayerGameName ?PlayerGameName .
            ?details player:PlayerGameID ?PlayerGameIDString .

            BIND(xsd:integer(?IdString) AS ?Id)
            BIND(xsd:integer(?PlayerGameIDString) AS ?PlayerGameID)
            BIND(xsd:integer(?PrizeString) AS ?Prize)
        }
        ORDER BY DESC(?Prize)
    """

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    players_data = []
    for result in results["results"]["bindings"]:
        player = {
            "id": int(result["Id"]["value"]),
            "playerName": result["PlayerName"]["value"],
            "socialLink": result["SocialLink"]["value"],
            "playerImageURL": result["PlayerImageURL"]["value"],
            "prize": result["Prize"]["value"],
            "playerGameName": result["PlayerGameName"]["value"],
            "playerGameID": int(result["PlayerGameID"]["value"])
        }
        players_data.append(player)

    return JsonResponse(players_data, safe=False)


from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import JsonResponse


# best player details
def get_best_player_details(request, game_id):
    if game_id is None:
        return JsonResponse({"error": "Invalid game ID"}, status=400)

    game_id_int = int(game_id)  # Convert game_id to an integer for safe injection

    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX player: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?PlayerId ?PlayerName ?SocialLink ?PlayerImageURL ?Prize ?PlayerGameName ?PlayerGameID WHERE {
          ?game rdf:type game:Game .
          ?game game:Id ?GameIdString .
          FILTER(xsd:integer(?GameIdString) = %d)
          ?game game:hasBestPlayer ?player .
          ?player player:Id ?PlayerIdString .
          ?player player:hasPlayerDetails ?details .
          ?details player:PlayerName ?PlayerName .
          ?details player:SocialLink ?SocialLink .
          ?details player:PlayerImageURL ?PlayerImageURL .
          ?details player:Prize ?PrizeString .
          ?details player:PlayerGameName ?PlayerGameName .
          ?details player:PlayerGameID ?PlayerGameIDString .

          BIND(xsd:integer(?PlayerIdString) AS ?PlayerId)
          BIND(xsd:integer(?PlayerGameIDString) AS ?PlayerGameID)
          BIND(xsd:integer(?PrizeString) AS ?Prize)
        }
    """ % game_id_int

    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    if results["results"]["bindings"]:
        result = results["results"]["bindings"][0]
        player_details = {
            "playerId": int(result["PlayerId"]["value"]),
            "playerName": result["PlayerName"]["value"],
            "socialLink": result["SocialLink"]["value"],
            "playerImageURL": result["PlayerImageURL"]["value"],
            "prize": int(result["Prize"]["value"]),
            "playerGameName": result["PlayerGameName"]["value"],
            "playerGameID": int(result["PlayerGameID"]["value"])
        }
        return JsonResponse(player_details, safe=False)
    else:
        return JsonResponse({"message": "Best player not found for the given game ID"}, status=404)
