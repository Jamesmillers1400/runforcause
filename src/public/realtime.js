// Filename: public/realtime.js
import { permissions } from 'wix-realtime-backend';

permissions.default((channel) => {
    return { read: true, publish: true }; // Tout le monde peut lire/publier (adaptez pour sécurité)
});
// Code written in public files is shared by your site's
// Backend, page code, and site code environments.

// Use public files to hold utility functions that can
// be called from multiple locations in your site's code.
export function add(param1, param2) {
	return param1 + param2;
}

// The following code demonstrates how to call the add
// function from your site's page code or site code.
/*
import {add} from 'public/realtime.js'
$w.onReady(function () {
    let sum = add(6,7);
    console.log(sum);
});
*/