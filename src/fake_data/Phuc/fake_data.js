export const activeUsers = [
  {id: '1', name: 'Isabelle', avatar: require('../../assets/images/avt1.png')},
  {id: '2', name: 'Ethan', avatar: require('../../assets/images/avt2.png')},
  {id: '3', name: 'Harper', avatar: require('../../assets/images/avt3.png')},
  {id: '4', name: 'Alexander', avatar: require('../../assets/images/avt4.png')},
];

export const recentChats = [
  {
    id: 'r1',
    user: 'Alexander',
    avatar: require('../../assets/images/avt4.png'),
    message: "Hey, what's up?",
    time: '4 min',
    unreadCount: 1,
  },
  {
    id: 'r2',
    user: 'Isabelle',
    avatar: require('../../assets/images/avt1.png'),
    message: 'That sounds cool. What...',
    time: '35 min',
    unreadCount: 3,
  },
  {
    id: 'r3',
    user: 'Harper',
    avatar: require('../../assets/images/avt3.png'),
    message: 'I like to do a lot of different...',
    time: '39 min',
    unreadCount: 5,
  },
  {
    id: 'r4',
    user: 'Ethan',
    avatar: require('../../assets/images/avt2.png'),
    message: "That's awesome.",
    time: 'Today',
    unreadCount: 0,
  },
];
