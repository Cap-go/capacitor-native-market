package com.getcapacitor.community.nativemarket;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeMarket")
public class NativeMarket extends Plugin {

  @PluginMethod
  public void openStoreListing(PluginCall call) {
    try {
      String appId = call.getString("appId");
      if (appId == null || appId.isEmpty()) {
        call.reject("appId is missing");
        return;
      }

      Context context = this.bridge.getActivity().getApplicationContext();
      Intent intent = new Intent(
        Intent.ACTION_VIEW,
        Uri.parse("market://details?id=" + appId)
      );
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);

      call.resolve();
    } catch (Exception ex) {
      call.reject(ex.getLocalizedMessage());
    }
  }

  @PluginMethod
  public void openDevPage(PluginCall call) {
    try {
      String devId = call.getString("devId");
      if (devId == null || devId.isEmpty()) {
        call.reject("devId is missing");
        return;
      }

      Context context = this.getContext();
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setData(
        Uri.parse("https://play.google.com/store/apps/dev?id=" + devId)
      );
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);

      call.resolve();
    } catch (Exception ex) {
      call.reject(ex.getLocalizedMessage());
    }
  }

  @PluginMethod
  public void openCollection(PluginCall call) {
    try {
      String name = call.getString("name");
      if (name == null || name.isEmpty()) {
        call.reject("name is missing");
        return;
      }

      Context context = this.getContext();
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setData(
        Uri.parse("https://play.google.com/store/apps/collection/" + name)
      );
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);

      call.resolve();
    } catch (Exception ex) {
      call.reject(ex.getLocalizedMessage());
    }
  }

  @PluginMethod
  public void openEditorChoicePage(PluginCall call) {
    try {
      String editorChoice = call.getString("editorChoice");
      if (editorChoice == null || editorChoice.isEmpty()) {
        call.reject("editorChoice is missing");
        return;
      }

      Context context = this.getContext();
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setData(
        Uri.parse("https://play.google.com/store/apps/topic?id=" + editorChoice)
      );
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);

      call.resolve();
    } catch (Exception ex) {
      call.reject(ex.getLocalizedMessage());
    }
  }

  @PluginMethod
  public void search(PluginCall call) {
    try {
      String terms = call.getString("terms");
      if (terms == null || terms.isEmpty()) {
        call.reject("terms is missing");
        return;
      }

      Context context = this.getContext();
      Intent intent = new Intent(
        Intent.ACTION_VIEW,
        Uri.parse("market://search?q=" + terms)
      );
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(intent);

      call.resolve();
    } catch (Exception ex) {
      call.reject(ex.getLocalizedMessage());
    }
  }
}
