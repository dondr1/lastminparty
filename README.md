**Last Min Party 🎉**
- React Native social events application where users discover events through a swipe interface and hosts curate their guest lists through a two-way approval system.

## 🎯 What It Does

Hot Swiper reimagines event discovery and attendance by combining the intuitive swipe mechanics of dating apps with a curated guest list experience. Instead of traditional event RSVPs, users and hosts both have control over who attends.

### 💡 The Core Concept

**Two-Way Matching System:**
- 👤 Users swipe on events they're interested in
- 🎭 Hosts review and approve users who showed interest
- ✨ Only mutual matches result in event attendance

This creates higher quality events with engaged attendees and gives hosts control over their guest list.

## 🚀 How It Works

### 1. 🔍 Discover Events

Users browse through a feed of upcoming events in a Tinder-style swipe interface. Each card shows the event details, host information, and event type (open or invite-only).

- **👉 Swipe Right** = Interested in attending
- **👈 Swipe Left** = Not interested

When a user swipes right, they're added to that event's waitlist.

### 2. 👀 Host Reviews Waitlist


Event hosts can see everyone who swiped right on their event. The host then reviews each interested user's profile and decides:

- **Accept** = Send them an invitation
- **Reject** = Remove from waitlist

Hosts can see user profiles including their avatar, username, bio, and interest tags to make informed decisions about their guest list.

### 3. 📬 User Receives Invitation

When a host accepts a user, the system automatically creates a formal invitation. Users can see all their pending invitations in their inbox.

### 4. 🎉 Join Event

Users can accept or decline invitations. Once accepted, they're added to the event as an official participant.

The "Your Events" screen shows two tabs:
- **🎪 Attending** - Events you've joined
- **🎭 Hosting** - Events you created

Each event card displays:
- 🎯 Event title and details
- 📅 Date and time
- 👤 Host information with avatar
- 🔓 "OPEN" button to view event details
- 🚪 "Leave" button to exit the event

## ✨ Key Features

### For Event Attendees 👥

**🔎 Smart Discovery**
- Swipe through curated events in your area
- See only events you haven't already decided on
- Filter out events you've created

**📨 Invitation System**
- Receive formal invites to events
- Accept or decline at your convenience
- Track all events you're attending in one place

**🎨 Profile Matching**
- Create a profile with interests and tags
- Hosts can see your profile before accepting
- Increases chances of attending events you'll enjoy

### For Event Hosts 🎭

**✅ Curated Guest Lists**
- Review every person interested in your event
- See user profiles, bios, and interests
- Accept only the people you want at your event

**🎪 Event Management**
- Create open or invite-only events
- Set capacity limits
- View and manage attendee lists
- Remove attendees if needed

**🎮 Full Control**
- Manage multiple events simultaneously
- Track RSVPs and waitlist in real-time
- Edit event details anytime

## 📱 User Experience

### Event Cards Show

- 🎯 Event title with emoji
- 🖼️ Event poster/image
- 📅 Date and time
- 📍 Location/venue
- 👤 Host username and avatar
- 🏷️ Event type badge (OPEN or INVITE ONLY)

### Event Types

**🌍 Open Events**
- Anyone can swipe and request to join
- Host still reviews and approves each attendee
- Appears in public event feed

**🔒 Invite-Only Events**
- More exclusive, curated experience
- Host has full control over guest list
- Still uses the swipe/match system

## 🔄 The Matching Flow

```
User Side:                          Host Side:
┌─────────────────┐                ┌─────────────────┐
│ 🔍 Browse Events │                │ ➕ Create Event  │
└────────┬────────┘                └────────┬────────┘
         │                                  │
         ▼                                  ▼
┌─────────────────┐                ┌─────────────────┐
│ 👉 Swipe Right  │───────────────▶│ 👀 View Waitlist│
│  (Interested)   │                │                 │
└─────────────────┘                └────────┬────────┘
                                            │
         ┌──────────────────────────────────┘
         │
         ▼
┌─────────────────┐                ┌─────────────────┐
│ 📬 Receive Invite│◀───────────────│ ✅ Accept User  │
└────────┬────────┘                └─────────────────┘
         │
         ▼
┌─────────────────┐
│ ✔️ Accept Invite │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 🎉 Join Event as│
│  Participant    │
└─────────────────┘
```

## 💭 Why Two-Way Matching?

Traditional event platforms have issues:
- ❌ **Open RSVPs** lead to flaky attendees and no-shows
- ❌ **Invite-only** requires hosts to know everyone beforehand
- ❌ **Public events** can attract unwanted guests

Hot Swiper solves this by:
- ✅ Requiring interest from both sides
- ✅ Letting hosts curate without prior connections
- ✅ Creating accountability through mutual selection
- ✅ Resulting in higher quality, more engaged events

## 🛠️ Tech Stack

Built with:
- 📱 **React Native** + Expo for cross-platform mobile
- 🔷 **TypeScript** for type safety
- 🗄️ **Supabase** for backend (PostgreSQL + Auth)
- 🧭 **React Navigation** for screen routing

## 🗂️ Database Architecture

The app uses a relational database with these core tables:

- 👤 **profiles** - User information and preferences
- 🎪 **events** - Event details and host info
- 👆 **event_swipes** - Tracks user interest (like/nope)
- ✅ **host_event_decisions** - Tracks host approvals (accept/reject)
- 📨 **event_invites** - Formal invitation records
- 🎉 **event_participants** - Final confirmed attendee list

This multi-stage flow ensures quality control at each step of the event joining process.

---

✨ Built for hosts who want control and attendees who want authentic event experiences. ✨
