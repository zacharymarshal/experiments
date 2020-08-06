package cmd

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/aymerick/raymond"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v2"
)

var buildCmd = &cobra.Command{
	Use:   "build",
	Short: "Build readme from list of experiments",
	Run:   build,
}

func init() {
	rootCmd.AddCommand(buildCmd)

	buildCmd.Flags().String("templates", "templates/", "Templates directory path")
	buildCmd.Flags().String("experiments", "experiments/", "Experiments directory path")
}

func build(cmd *cobra.Command, args []string) {
	experimentsDir, err := cmd.Flags().GetString("experiments")
	if err != nil {
		panic(err)
	}
	var experiments []string
	err = filepath.Walk(experimentsDir,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			ok, err := filepath.Match("experiment.yml", info.Name())
			if err != nil {
				return err
			}
			if !ok {
				return nil
			}
			experiments = append(experiments, filepath.ToSlash(path))
			return nil
		})
	if err != nil {
		panic(err)
	}

	var experiments2 []*Experiment
	for _, exp := range experiments {
		yml, err := ioutil.ReadFile(exp)
		if err != nil {
			panic(err)
		}
		var e *Experiment
		err = yaml.Unmarshal(yml, &e)
		if err != nil {
			panic(err)
		}
		experiments2 = append(experiments2, e)
	}

	readmePath := getTemplate(cmd, "readme.md")
	tpl, err := raymond.ParseFile(readmePath)
	if err != nil {
		panic(err)
	}
	tpl.RegisterHelper("toolList", func(tools []*Tool) string {
		list := make([]string, 0, len(tools))
		for _, t := range tools {
			if t.Url != "" {
				list = append(list, fmt.Sprintf("[%s](%s)", t.Name, t.Url))
			} else {
				list = append(list, t.Name)
			}
		}
		return strings.Join(list, ", ")
	})

	readme, err := tpl.Exec(map[string]interface{}{
		"experiments": experiments2,
	})
	if err != nil {
		panic(err)
	}
	fmt.Print(readme)
}
