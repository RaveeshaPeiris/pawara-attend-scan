package app.lovable.c9fcadfffcc64ee28fdd9412b79b66b5;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ❌DO NOT register BarcodeScannerPlugin manually
    }
}