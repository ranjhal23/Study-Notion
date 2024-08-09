#include <bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
       int n;
       cin>>n;
       long long a[n];
       for(int i=0; i<n; i++){
        cin>>a[i];
       }
       if(n==1 && a[0]==0){
        cout<<1<<endl;
        continue;
       }
       if(n==2){
        if(a[0]==a[1]) cout<<1<<endl;
        else cout<<0<<endl;
        continue;
       }
        unordered_map<long long,int> mp;
        long long sum = 0,cnt=0;
        for(int i=0;i<n;i++) {
           mp[a[i]]++;
           sum += a[i];
 
           if(sum%2 == 0){if(mp.find(sum/2)!=mp.end())cnt++;}
        }
        cout<<cnt<<endl;

    } 
    return 0;
}