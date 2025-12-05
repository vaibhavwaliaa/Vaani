package com.reactnative;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;
import android.Manifest;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FloatingCaptionModule extends ReactContextBaseJavaModule {
    private static final String TAG = "FloatingCaptionModule";
    private static final String MODULE_NAME = "FloatingCaptionModule";
    private final ReactApplicationContext reactContext;

    public FloatingCaptionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void checkOverlayPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            boolean canDrawOverlays = Settings.canDrawOverlays(reactContext);
            promise.resolve(canDrawOverlays);
        } else {
            // Permission automatically granted for API < 23
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(reactContext)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + reactContext.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
            }
        }
    }

    @ReactMethod
    public void startFloatingService(Promise promise) {
        try {
            Log.d(TAG, "startFloatingService called");
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                boolean hasPermission = Settings.canDrawOverlays(reactContext);
                Log.d(TAG, "Overlay permission: " + hasPermission);
                
                if (!hasPermission) {
                    promise.reject("PERMISSION_DENIED", "Overlay permission not granted");
                    Toast.makeText(reactContext, "Please grant overlay permission first", Toast.LENGTH_LONG).show();
                    return;
                }
            }

            // On Android 13+ (TIRAMISU), apps need POST_NOTIFICATIONS to display FGS notification reliably
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (reactContext.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    Log.w(TAG, "Missing POST_NOTIFICATIONS permission; prompting user to enable app notifications");
                    Toast.makeText(reactContext, "Please enable notifications for captions to run in background", Toast.LENGTH_LONG).show();
                    // Open app notification settings as we cannot request POST_NOTIFICATIONS from a Service module directly
                    Intent settingsIntent = new Intent();
                    settingsIntent.setAction(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                    settingsIntent.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, reactContext.getPackageName());
                    settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    reactContext.startActivity(settingsIntent);
                }
            }

            Intent serviceIntent = new Intent(reactContext, FloatingCaptionService.class);
            Log.d(TAG, "Starting FloatingCaptionService...");
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(serviceIntent);
                Log.d(TAG, "Started as foreground service");
            } else {
                reactContext.startService(serviceIntent);
                Log.d(TAG, "Started as regular service");
            }
            
            Toast.makeText(reactContext, "Floating caption service started!", Toast.LENGTH_SHORT).show();
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error starting service: " + e.getMessage(), e);
            Toast.makeText(reactContext, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
            promise.reject("START_SERVICE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopFloatingService(Promise promise) {
        try {
            Intent serviceIntent = new Intent(reactContext, FloatingCaptionService.class);
            reactContext.stopService(serviceIntent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("STOP_SERVICE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void updateCaption(String text) {
        Intent intent = new Intent("com.reactnative.UPDATE_CAPTION");
        intent.putExtra("caption_text", text);
        reactContext.sendBroadcast(intent);
    }
}
