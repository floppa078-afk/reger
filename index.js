import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";

const ChannelActionCreators = findByProps("call", "selectVoiceChannel");
const VoiceStateStore = findByProps("getVoiceStateForUser");
const UserStore = findByProps("getCurrentUser");

const TARGET_REGION = "rotterdam"; // Ближайший дата-центр к Эстонии (альтернатива: "frankfurt" или "stockholm")

function onVoiceStateUpdate(event) {
    const currentUser = UserStore?.getCurrentUser();
    if (!currentUser || !event.voiceStates) return;

    for (const state of event.voiceStates) {
        if (state.userId === currentUser.id && state.channelId) {
            if (ChannelActionCreators?.changeCallRegion) {
                ChannelActionCreators.changeCallRegion(state.channelId, TARGET_REGION);
            }
        }
    }
}

export default {
    onLoad() {
        FluxDispatcher.subscribe("VOICE_STATE_UPDATES", onVoiceStateUpdate);
    },
    onUnload() {
        FluxDispatcher.unsubscribe("VOICE_STATE_UPDATES", onVoiceStateUpdate);
    }
};
