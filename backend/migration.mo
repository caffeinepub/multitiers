import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  module OldPlayer {
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
  };

  type OldPlayer = OldPlayer.Player;
  type OldActor = {
    players : Map.Map<Nat, OldPlayer>;
    nextId : Nat;
  };

  module NewPlayer {
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
  };

  type NewPlayer = NewPlayer.Player;
  type NewActor = {
    players : Map.Map<Nat, NewPlayer>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPlayers = old.players.map<Nat, OldPlayer, NewPlayer>(
      func(_id, oldPlayer) {
        { oldPlayer with avatarUrl = null };
      }
    );
    { old with players = newPlayers };
  };
};
