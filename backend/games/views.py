import json
import re
import spacy
from spacy.matcher import Matcher
from json import JSONDecodeError
from urllib.parse import quote as urlquote
from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token


# set csrf token
def set_csrf_token(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response.set_cookie('csrftoken', get_token(request))
    return response


# get video games lit
def get_video_games(request):
    search_query = request.GET.get('search', '')  # Get search query from request parameters
    page = int(request.GET.get('page', 1))  # Get current page number from request, default is 1
    limit = 21  # Number of items per page
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
        PREFIX company: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>

        SELECT ?Id ?Title ?CoverURL ?TrailerURL ?Summary ?Top ?ReleaseDate ?Ranking ?TimesListed ?NumberOfReviews ?PlayerName (GROUP_CONCAT(DISTINCT CONCAT(?DeveloperID, "|", ?DeveloperName); separator=", ") AS ?Developers) WHERE {
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
          ?x game:PlayerName ?PlayerName .
          OPTIONAL {
            ?x game:gameDevelopedBy ?dev .
            ?dev company:CompanyID ?DeveloperID .
            ?dev company:Name ?DeveloperName .
          }
          FILTER(xsd:integer(?IdString) = %d)
        } GROUP BY ?Id ?Title ?CoverURL ?TrailerURL ?Summary ?Top ?ReleaseDate ?Ranking ?TimesListed ?NumberOfReviews ?PlayerName
        ORDER BY ?Id
    """ % int(game_id)

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    game_data = None
    for result in results["results"]["bindings"]:
        developers_raw = result.get("Developers", {}).get("value", "").split(", ")
        developers = []
        for dev in developers_raw:
            if dev:
                dev_parts = dev.split("|")
                if len(dev_parts) == 2:
                    developers.append({"companyId": dev_parts[0], "name": dev_parts[1]})

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
            "developers": developers
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


# get the best player details
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


# get companies list
def get_company_list(request):
    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX company: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>

        SELECT ?CompanyID ?Name ?Description ?CompanyLogoURL WHERE {
          ?comp rdf:type company:Company .
          ?comp company:CompanyID ?CompanyID .
          ?comp company:Name ?Name .
          ?comp company:Description ?Description .
          ?comp company:CompanyLogoURL ?CompanyLogoURL .

        }
    """

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    company_data = []
    for result in results["results"]["bindings"]:
        company = {
            "id": result["CompanyID"]["value"],
            "name": result["Name"]["value"],
            "description": result["Description"]["value"],
            "companyLogoURL": result["CompanyLogoURL"]["value"]
        }
        company_data.append(company)

    return JsonResponse(company_data, safe=False)


# get company details
def get_company_details(request, company_id):
    safe_company_id = urlquote(company_id)

    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX company: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX game: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>

        SELECT ?CompanyID ?Name ?Description ?CompanyLogoURL ?Location ?OfficialSitURL ?GameID ?GameTitle WHERE {
          ?comp rdf:type company:Company .
          ?comp company:CompanyID ?CompanyID .
          FILTER(str(?CompanyID) = "%s")
          ?comp company:Name ?Name .
          ?comp company:Description ?Description .
          ?comp company:CompanyLogoURL ?CompanyLogoURL .
          ?comp company:Location ?Location .
          ?comp company:OfficialSitURL ?OfficialSitURL .
          OPTIONAL {
            ?comp company:hasDevelopedGame ?game .
            ?game game:Id ?GameID .
            ?game game:Title ?GameTitle .
          }
        }
    """ % safe_company_id

    # Query RDF data using SPARQL
    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    # Process SPARQL results and return as JSON response
    if results["results"]["bindings"]:
        result = results["results"]["bindings"][0]  # Assuming CompanyID is unique
        company_details = {
            "id": result["CompanyID"]["value"],
            "name": result["Name"]["value"],
            "description": result["Description"]["value"],
            "companyLogoURL": result["CompanyLogoURL"]["value"],
            "location": result["Location"]["value"],
            "officialSiteURL": result["OfficialSitURL"]["value"],
            "games": [{"id": game["GameID"]["value"], "title": game["GameTitle"]["value"]}
                      for game in results["results"]["bindings"] if "GameID" in game]
        }
        return JsonResponse(company_details, safe=False)
    else:
        return JsonResponse({"error": "Company not found"}, status=404)


# queries for nlt
def fetch_games(limit):
    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX game: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?Id ?Title WHERE {
          ?x game:Id ?IdString .
          BIND(xsd:integer(?IdString) AS ?Id)
          ?x game:Title ?Title .
        } ORDER BY ?Id LIMIT %d
    """ % limit

    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    games_data = []
    for result in results["results"]["bindings"]:
        game = {
            "id": int(result["Id"]["value"]),
            "title": result["Title"]["value"],
        }
        games_data.append(game)

    return games_data


def fetch_players(limit):
    sparql_query = """
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX player: <http://www.semanticweb.org/ozodorifjonov/ontologies/2023/10/video-games-v2#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        SELECT ?Id ?PlayerName ?PlayerGameName WHERE {
            ?player rdf:type player:Player .
            ?player player:Id ?IdString .
            ?player player:hasPlayerDetails ?details .
            ?details player:PlayerName ?PlayerName .
            ?details player:PlayerGameName ?PlayerGameName .

            BIND(xsd:integer(?IdString) AS ?Id)
        } LIMIT %d
    """ % limit

    sparql = SPARQLWrapper("http://localhost:3030/video-games-v2/query")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    players_data = []
    for result in results["results"]["bindings"]:
        player = {
            "id": int(result["Id"]["value"]),
            "playerName": result["PlayerName"]["value"],
            "playerGameName": result["PlayerGameName"]["value"],
        }
        players_data.append(player)

    return players_data


nlp = spacy.load("en_core_web_sm")

matcher = Matcher(nlp.vocab)

patterns = {
    "fetch_games": [{"LOWER": {"REGEX": "\d+"}}, {"LOWER": "best"}, {"LOWER": "games"}],
    "fetch_players": [{"LOWER": {"REGEX": "\d+"}}, {"LOWER": "best"}, {"LOWER": "players"}],
    "greeting": [{"LOWER": {"IN": ["hello", "hi", "how are you"]}}],
    "informal_greeting": [{"LOWER": {"IN": ["wassup", "whassup"]}}],
    "gratitude": [{"LOWER": {"IN": ["thanks", "thank you"]}}],
    "farewell": [{"LOWER": {"IN": ["bye", "goodbye", "good bye"]}}],
}

for label, pattern in patterns.items():
    matcher.add(label, [pattern])


def analyze_text(text):
    doc = nlp(text.lower())
    matches = matcher(doc)
    analysis_results = {}

    for match_id, start, end in matches:
        rule_id = nlp.vocab.strings[match_id]
        span = doc[start:end]
        match_text = span.text

        if rule_id == "fetch_games":
            analysis_results["fetch_games"] = True
            analysis_results["number"] = int(re.search(r"\d+", match_text).group())
        elif rule_id == "fetch_players":
            analysis_results["fetch_players"] = True
            analysis_results["number"] = int(re.search(r"\d+", match_text).group())
        else:
            analysis_results[rule_id] = True

    return analysis_results


@require_http_methods(["POST"])
def ask_AI(request):
    try:
        data = json.loads(request.body)
        text = data.get("text", "")
        analysis_results = analyze_text(text)

        if analysis_results:
            if analysis_results.get("fetch_games"):
                games_list = fetch_games(analysis_results.get("number"))
                games_text = "Here's a list of {} games:\n".format(len(games_list))
                for idx, game in enumerate(games_list, start=1):
                    games_text += "{}. {}\n".format(idx, game['title'])
                return JsonResponse({"message": games_text})

            if analysis_results.get("fetch_players"):
                players_list = fetch_players(analysis_results.get("number"))
                players_text = "Here's a list of {} players:\n".format(len(players_list))
                for idx, player in enumerate(players_list, start=1):
                    players_text += "{}. {} - {}\n".format(idx, player['playerName'], player['playerGameName'])
                return JsonResponse({"message": players_text})

            if analysis_results.get("greeting"):
                return JsonResponse({"message": "Hi, How can I help you?"})

            if analysis_results.get("informal_greeting"):
                return JsonResponse({"message": "Hey dude! What can I do for you 😎?"})

            if analysis_results.get("gratitude"):
                return JsonResponse({"message": "You're welcome! If you have any more questions, feel free to ask 😉."})

            if analysis_results.get("farewell"):
                return JsonResponse({"message": "See you later. Bye bye 👋"})
        else:
            return JsonResponse({"message": "I do not have an answer for this request.\nPlease send another one 🤓"})

    except JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
