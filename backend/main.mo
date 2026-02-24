import AccessControl "authorization/access-control";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Migration "migration";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
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
      avatarUrl : ?Text;
    };

    public func compare(player1 : Player, player2 : Player) : Order.Order {
      Text.compare(player1.name, player2.name);
    };
  };

  type Player = Player.Player;
  type Tier = Player.Tier;
  type Category = Player.Category;

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextId = 1;
  let players = Map.empty<Nat, Player>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

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
    avatarUrl : ?Text,
  ) : async Player {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add players");
    };
    if (name.isEmpty()) { Runtime.trap("Name cannot be empty") };
    let player : Player = {
      id = nextId;
      name;
      tier;
      score;
      category;
      avatarUrl;
    };
    players.add(nextId, player);
    nextId += 1;
    player;
  };

  public shared ({ caller }) func removePlayer(playerId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove players");
    };
    if (players.containsKey(playerId)) {
      players.remove(playerId);
    } else {
      Runtime.trap("Player does not exist");
    };
  };
};
