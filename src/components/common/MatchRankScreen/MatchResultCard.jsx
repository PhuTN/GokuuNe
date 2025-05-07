// GameResultCard.tsx
import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../../asycnc_store/LanguageContext';
import { translations } from '../../../untils/i18n';
import { Result } from '../../../fake_data/Binh/fake_data';
import { playVictorySound } from '../../../untils/VictorySound';

const GameResultCard = ({ gameResult, navigation }) => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  const resText = gameResult.resultText == "Victory" ? t.win_text : t.lose_text
  const resTextStyle = StyleSheet.create({
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: gameResult.resultText == "Victory" ? "#FFF400" : "red"
    }
  });
  useEffect(() => {
    if (gameResult.resultText == "Victory") {
      playVictorySound();
    }
  }, [])
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={resTextStyle.title}>{resText}</Text>

        </View>

        {/* Players */}
        <View style={styles.body}>
          <View style={styles.playersRow}>
            {/* Player 1 */}
            <View style={styles.player}>
              <Image
                source={{ uri: gameResult.playerWhite.userAvatarURL.uri }}
                style={styles.avatar}
              />
              <Text style={styles.playerName}>{gameResult.playerWhite.userName}</Text>
            </View>

            {/* Score */}
            <Text style={styles.score}>{gameResult.blackScore} - {gameResult.whiteScore}</Text>

            {/* Player 2 */}
            <View style={styles.player}>
              <Image
                source={{ uri: gameResult.playerBlack.userAvatarURL.uri }}
                style={styles.avatar}
              />
              <Text style={styles.playerName}>{gameResult.playerBlack.userName}</Text>
            </View>
          </View>

          {/* Ratings */}
          <View style={styles.ratings}>
            <Text style={styles.ratingTitle}>{t.rank_text}</Text>
            <Text style={styles.ratingValue}>
              {Result.currentRank} <Text style={styles.ratingChange}>{Result.rankRising}</Text>
            </Text>
            <Text style={styles.leagueTitle}>{t.elo_text}</Text>
            <Text style={styles.ratingValue}>
              {Result.currentElo} <Text style={styles.ratingGain}>{Result.eloRisiing}</Text>
            </Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{t.report_text}</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={(e) => {
              e.preventDefault();
              navigation.replace("RankingMatch");
            }}>
              <Text>{t.rematch_text}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={(e) => {
              e.preventDefault();
              navigation.replace("RankingMatch");
            }}>
              <Text style={styles.button_text}>{t.new_text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button_text: {
    textAlign: 'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,

    width: 300,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  body: {
    width: "100%",
    padding: 16
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'gray',
    borderRadius: 10,
    paddingVertical: 10
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  player: {
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  playerName: {
    marginTop: 8,
    fontSize: 12,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratings: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingValue: {
    fontSize: 22,
    marginVertical: 4,
  },
  ratingChange: {
    color: 'gray',
    fontSize: 16,
  },
  leagueTitle: {
    fontSize: 14,
    color: 'gray',
  },
  ratingGain: {
    color: 'green',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#8BC34A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default GameResultCard;
