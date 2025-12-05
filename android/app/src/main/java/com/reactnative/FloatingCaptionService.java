package com.reactnative;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import com.mobileapp.MainActivity;
import com.mobileapp.R;
import java.util.ArrayList;

public class FloatingCaptionService extends Service {
    private static final String TAG = "FloatingCaptionService";
    private static final String CHANNEL_ID = "FloatingCaptionChannel";
    private static final int NOTIFICATION_ID = 1;
    
    private WindowManager windowManager;
    private View floatingView;
    private View captionView;
    private TextView captionText;
    private boolean isCaptioning = false;
    private SpeechRecognizer speechRecognizer;
    private Intent speechRecognizerIntent;
    
    private BroadcastReceiver captionUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String text = intent.getStringExtra("caption_text");
            if (text != null) {
                updateCaption(text);
            }
        }
    };

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand called");
        // If for some reason onCreate failed before calling startForeground, ensure we are foreground
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                // Check if we already started foreground by verifying notification channel exists
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) {
                    // Build a minimal notification if needed
                    createNotificationChannel();
                    Notification notif = createNotification();
                    startForeground(NOTIFICATION_ID, notif);
                }
            } catch (Exception e) {
                Log.e(TAG, "startForeground fallback failed: " + e.getMessage(), e);
            }
        }
        return START_STICKY; // Service will restart if killed
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "FloatingCaptionService onCreate() called");
        
        try {
            // Inflate floating button layout first
            floatingView = LayoutInflater.from(this).inflate(R.layout.floating_button, null);
            captionView = LayoutInflater.from(this).inflate(R.layout.floating_caption, null);
            captionText = captionView.findViewById(R.id.captionText);
            Log.d(TAG, "Layouts inflated successfully");

            // Create notification channel for foreground service
            createNotificationChannel();
            
            // Start as foreground service IMMEDIATELY
            startForeground(NOTIFICATION_ID, createNotification());
            Log.d(TAG, "Started as foreground service");
            
            // Register broadcast receiver for caption updates
            IntentFilter filter = new IntentFilter("com.reactnative.UPDATE_CAPTION");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                registerReceiver(captionUpdateReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
            } else {
                registerReceiver(captionUpdateReceiver, filter);
            }
            Log.d(TAG, "Broadcast receiver registered");

            // Set up window manager parameters for floating button
            final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                            : WindowManager.LayoutParams.TYPE_PHONE,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT
            );

            params.gravity = Gravity.TOP | Gravity.START;
            params.x = 0;
            params.y = 100;

            // Set up caption window parameters
            final WindowManager.LayoutParams captionParams = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                            : WindowManager.LayoutParams.TYPE_PHONE,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT
            );

            captionParams.gravity = Gravity.BOTTOM;
            captionParams.y = 100;

            // Set up speech recognizer
            setupSpeechRecognizer();
            
            windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
            
            if (windowManager == null) {
                Log.e(TAG, "WindowManager is null!");
                Toast.makeText(this, "Failed to get WindowManager", Toast.LENGTH_LONG).show();
                return;
            }
            
            windowManager.addView(floatingView, params);
            Log.d(TAG, "Floating button added to WindowManager");
            
            Toast.makeText(this, "Floating caption button is now visible!", Toast.LENGTH_SHORT).show();

            final ImageView floatingIcon = floatingView.findViewById(R.id.floatingIcon);

            // Make button draggable
            floatingView.setOnTouchListener(new View.OnTouchListener() {
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return true;

                    case MotionEvent.ACTION_UP:
                        int xDiff = (int) (event.getRawX() - initialTouchX);
                        int yDiff = (int) (event.getRawY() - initialTouchY);

                        // Click detection (small movement)
                        if (Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) {
                            toggleCaptioning();
                        }
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
                        params.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingView, params);
                        return true;
                }
                return false;
            }
        });
        } catch (Exception e) {
            Log.e(TAG, "Error in onCreate: " + e.getMessage(), e);
            Toast.makeText(this, "Error creating floating button: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    private void toggleCaptioning() {
        if (isCaptioning) {
            stopCaptioning();
        } else {
            startCaptioning();
        }
    }

    private void startCaptioning() {
        isCaptioning = true;
        
        // Change button appearance
        ImageView floatingIcon = floatingView.findViewById(R.id.floatingIcon);
        floatingIcon.setImageResource(R.drawable.ic_caption_on);
        
        // Show caption view
        if (captionView.getParent() == null) {
            WindowManager.LayoutParams captionParams = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                            : WindowManager.LayoutParams.TYPE_PHONE,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT
            );
            captionParams.gravity = Gravity.BOTTOM;
            captionParams.y = 100;
            
            try {
                windowManager.addView(captionView, captionParams);
                Log.d(TAG, "Caption view added to WindowManager");
                updateCaption("🎤 Ready to listen...");
            } catch (Exception e) {
                Log.e(TAG, "Error adding caption view: " + e.getMessage(), e);
            }
        } else {
            Log.d(TAG, "Caption view already added");
            updateCaption("🎤 Ready to listen...");
        }

        // Start real-time speech recognition
        startSpeechRecognition();
    }

    private void stopCaptioning() {
        isCaptioning = false;
        
        // Change button appearance
        ImageView floatingIcon = floatingView.findViewById(R.id.floatingIcon);
        floatingIcon.setImageResource(R.drawable.ic_caption_off);
        
        // Hide caption view
        if (captionView.getParent() != null) {
            windowManager.removeView(captionView);
        }

        // Stop speech recognition
        stopSpeechRecognition();
    }

    private void startSystemAudioCapture() {
        // This will be implemented with MediaProjection API
        // For now, send broadcast to MainActivity to start capture
        Intent intent = new Intent("com.reactnative.START_AUDIO_CAPTURE");
        sendBroadcast(intent);
    }

    private void stopSystemAudioCapture() {
        Intent intent = new Intent("com.reactnative.STOP_AUDIO_CAPTURE");
        sendBroadcast(intent);
    }

    public void updateCaption(String text) {
        if (captionText != null) {
            Log.d(TAG, "Updating caption: " + text);
            captionText.post(() -> {
                captionText.setText(text);
                captionText.setVisibility(View.VISIBLE);
            });
        } else {
            Log.e(TAG, "captionText is null, cannot update caption");
        }
    }

    private void setupSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(this)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
            speechRecognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US");
            speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
            speechRecognizerIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
            
            speechRecognizer.setRecognitionListener(new RecognitionListener() {
                @Override
                public void onReadyForSpeech(Bundle params) {
                    Log.d(TAG, "Ready for speech");
                    updateCaption("🎤 Listening...");
                }

                @Override
                public void onBeginningOfSpeech() {
                    Log.d(TAG, "Beginning of speech");
                    updateCaption("🗣️ Speaking...");
                }

                @Override
                public void onRmsChanged(float rmsdB) {
                    // Audio level changed - could add visual indicator here
                }

                @Override
                public void onBufferReceived(byte[] buffer) {
                    // Audio buffer received
                }

                @Override
                public void onEndOfSpeech() {
                    Log.d(TAG, "End of speech");
                    updateCaption("🔄 Processing...");
                }

                @Override
                public void onError(int error) {
                    Log.e(TAG, "Speech recognition error: " + error);
                    String errorMessage = getErrorMessage(error);
                    updateCaption("❌ " + errorMessage);
                    
                    // Only restart if it's not a client error or insufficient permissions
                    if (isCaptioning && speechRecognizer != null && error != SpeechRecognizer.ERROR_CLIENT) {
                        // Add a small delay before restarting
                        new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                            if (isCaptioning && speechRecognizer != null) {
                                Log.d(TAG, "Restarting speech recognition after error");
                                speechRecognizer.startListening(speechRecognizerIntent);
                            }
                        }, 1000);
                    }
                }

                @Override
                public void onResults(Bundle results) {
                    ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    if (matches != null && !matches.isEmpty()) {
                        String recognizedText = matches.get(0);
                        Log.d(TAG, "Recognized: " + recognizedText);
                        updateCaption("💬 " + recognizedText);
                        
                        // Show the result for 3 seconds before restarting
                        new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                            if (isCaptioning && speechRecognizer != null) {
                                Log.d(TAG, "Restarting speech recognition after results");
                                speechRecognizer.startListening(speechRecognizerIntent);
                            }
                        }, 3000);
                    } else {
                        // No results, restart immediately
                        if (isCaptioning && speechRecognizer != null) {
                            speechRecognizer.startListening(speechRecognizerIntent);
                        }
                    }
                }

                @Override
                public void onPartialResults(Bundle partialResults) {
                    ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    if (matches != null && !matches.isEmpty()) {
                        String partialText = matches.get(0);
                        Log.d(TAG, "Partial: " + partialText);
                        updateCaption("✏️ " + partialText + "...");
                    }
                }

                @Override
                public void onEvent(int eventType, Bundle params) {
                    // Speech recognition event
                }
            });
        } else {
            Log.e(TAG, "Speech recognition not available on this device");
            Toast.makeText(this, "Speech recognition not available", Toast.LENGTH_LONG).show();
        }
    }

    private void startSpeechRecognition() {
        if (speechRecognizer != null && speechRecognizerIntent != null) {
            Log.d(TAG, "Starting speech recognition");
            updateCaption("🎤 Starting microphone...");
            speechRecognizer.startListening(speechRecognizerIntent);
        }
    }

    private void stopSpeechRecognition() {
        if (speechRecognizer != null) {
            Log.d(TAG, "Stopping speech recognition");
            speechRecognizer.stopListening();
            speechRecognizer.cancel();
            updateCaption("🔇 Microphone stopped");
        }
    }

    private String getErrorMessage(int errorCode) {
        switch (errorCode) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "Audio recording error";
            case SpeechRecognizer.ERROR_CLIENT:
                return "Client side error";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "Insufficient permissions";
            case SpeechRecognizer.ERROR_NETWORK:
                return "Network error";
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "Network timeout";
            case SpeechRecognizer.ERROR_NO_MATCH:
                return "No match found";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "Recognition service busy";
            case SpeechRecognizer.ERROR_SERVER:
                return "Server error";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "No speech input";
            default:
                return "Unknown error";
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy called - cleaning up");
        
        // Stop speech recognition
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
        
        // Unregister receiver
        try {
            unregisterReceiver(captionUpdateReceiver);
            Log.d(TAG, "Broadcast receiver unregistered");
        } catch (Exception e) {
            Log.e(TAG, "Error unregistering receiver: " + e.getMessage());
        }
        
        // Remove views
        try {
            if (windowManager != null) {
                if (floatingView != null && floatingView.getParent() != null) {
                    windowManager.removeView(floatingView);
                    Log.d(TAG, "Floating view removed");
                }
                if (captionView != null && captionView.getParent() != null) {
                    windowManager.removeView(captionView);
                    Log.d(TAG, "Caption view removed");
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error removing views: " + e.getMessage());
        }
        
        Toast.makeText(this, "Floating caption service stopped", Toast.LENGTH_SHORT).show();
    }
    
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Floating Caption Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Provides real-time captions in a floating overlay");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
    
    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                notificationIntent,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                        ? PendingIntent.FLAG_IMMUTABLE
                        : 0
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Floating Captions")
                .setContentText("Tap the floating button to start/stop captions")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }
}
