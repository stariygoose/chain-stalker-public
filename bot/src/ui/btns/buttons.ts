export const backBtn = {
	text: '❮❮ Back', callback_data: 'action:back'
};

export const cancelBtn = {
	text: '❌ Cancel', callback_data: 'action:cancel'
}

export const menuBtn = {
	text: '🏠 Menu', callback_data: 'action:menu'
}

export const changeStrategyBtn = (
	id: string
) => {
	return {
		text: '🎯 Change strategy',
		callback_data: `edit:${id}:strategy`
	}
}

export const changeThesholdBtn = (
	id: string
) => {
	return {
		text: '⚖️ Change threshold',
		callback_data: `edit:${id}:threshold`
	}
}

export const subStatusBtn = (
	id: string,
	isActive: boolean
) => {
	return {
		text: isActive ? '🔴 Deactivate' : '🟢 Activate',
		callback_data: `edit:${id}:isActive:${!isActive}`
	}
}

export const deleteBtn = (
	id: string
) => {
	return {
		text: '🗑️ Delete',
		callback_data: `edit:${id}:delete`
	}
}

export const yesBtn = {
	text: '✅ Yes'
}

export const percentageStrategy = {
	text: '💯 Percentage', callback_data: 'strategy:percentage'
}

export const absoluteStrategy = {
	text: '💵 Absolute', callback_data: 'strategy:absolute'
}

export const tokenCommand = { 
	text: '🪙 Token', callback_data: 'scene:token'
}

export const collectionCommand = {
	text: '🖼️ Collection', callback_data: 'scene:collection'
}

export const myStalksCommand = {
	text: '📋 My Stalks', callback_data: 'scene:stalks'
}

