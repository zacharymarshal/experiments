package cmd

import (
	"experiments-cli/namegen"
	"fmt"

	"github.com/spf13/cobra"
)

// namegenCmd represents the namegen command
var namegenCmd = &cobra.Command{
	Use:   "namegen",
	Short: "Generate a random code name",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println(namegen.GetRandomName())
	},
}

func init() {
	rootCmd.AddCommand(namegenCmd)
}
