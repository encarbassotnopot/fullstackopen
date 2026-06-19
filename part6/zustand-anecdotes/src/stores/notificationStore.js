import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
	notification: null,
	notificationTimeout: null,
	setNotification: (text) => {
		if (get().notificationTimeout) clearTimeout(get().notificationTimeout);
		set(() => ({
			notification: text,
			notificationTimeout: setTimeout(
				() =>
					set(() => ({
						notification: null,
						notificationTimeout: null,
					})),
				5000
			),
		}));
	},
}));

export const useNotification = () =>
	useNotificationStore((state) => state.notification);

export const useNotificationAction = () =>
	useNotificationStore((state) => state.setNotification);
