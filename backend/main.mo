import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

// This is a no-op change to force redeployment of the non-responding canister

actor {
  module Player {
    public type Tier = {
      #LT5;
      #HT5;
      #LT4;
      #HT4;
      #LT3;
      #HT3;
      #LT2;
      #HT2;
      #LT1;
      #HT1;
    };

    public type Category = {
      #Sword;
      #Axe;
      #Crystal;
      #Mace;
      #Spearmace;
      #DiamondSMP;
      #UHC;
      #SMP;
    };

    public type Player = {
      id : Nat;
      name : Text;
      tier : Tier;
      score : Int;
      category : Category;
    };

    public func compare(player1 : Player, player2 : Player) : Order.Order {
      Text.compare(player1.name, player2.name);
    };
  };

  type Player = Player.Player;
  type Tier = Player.Tier;
  type Category = Player.Category;

  var nextId = 1;

  let players = Map.empty<Nat, Player>();

  public query ({ caller }) func getAllPlayers() : async [Player] {
    players.values().toArray().sort();
  };

  public query ({ caller }) func getPlayersByTier(tier : Tier) : async [Player] {
    players.values().toArray().sort().filter(
      func(player) { player.tier == tier }
    );
  };

  public query ({ caller }) func getPlayersByCategory(category : Category) : async [Player] {
    players.values().toArray().sort().filter(
      func(player) { player.category == category }
    );
  };

  public query ({ caller }) func getPlayersByTierAndCategory(tier : Tier, category : Category) : async [Player] {
    players.values().toArray().sort().filter(
      func(player) { player.tier == tier and player.category == category }
    );
  };

  public query ({ caller }) func searchPlayersByName(searchTerm : Text) : async [Player] {
    players.values().toArray().sort().filter(
      func(player) {
        player.name.toLower().contains(#text(searchTerm.toLower()));
      }
    );
  };

  public shared ({ caller }) func addPlayer(
    name : Text,
    tier : Tier,
    score : Int,
    category : Category,
  ) : async Player {
    if (name.isEmpty()) { Runtime.trap("Name cannot be empty") };
    let player : Player = {
      id = nextId;
      name;
      tier;
      score;
      category;
    };
    players.add(nextId, player);
    nextId += 1;
    player;
  };
};
